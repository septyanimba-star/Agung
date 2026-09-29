import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Earthquake, StationData } from '../types';

interface MapProps {
  earthquakes: Earthquake[];
  stations: StationData[];
  selectedEarthquake: Earthquake | null;
  onSelectEarthquake: (eq: Earthquake) => void;
}

export default function MapView({ earthquakes, stations, selectedEarthquake, onSelectEarthquake }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map centered on Indonesia
    mapRef.current = L.map(mapContainerRef.current, {
      center: [-2.5, 118.0],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
    });

    // Add satellite tile layer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Add labels overlay
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      opacity: 0.7,
    }).addTo(mapRef.current);

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);

    // Create layer group for markers
    markersRef.current = L.layerGroup().addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!markersRef.current || !mapRef.current) return;

    markersRef.current.clearLayers();

    // Add station markers
    stations.forEach(station => {
      const statusColor = station.status === 'active' ? '#22c55e' : 
                          station.status === 'maintenance' ? '#eab308' : '#ef4444';
      
      const stationIcon = L.divIcon({
        className: 'station-marker',
        html: `<div style="
          width: 12px;
          height: 12px;
          background: ${statusColor};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 0 6px ${statusColor};
        "></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      const marker = L.marker([station.latitude, station.longitude], { icon: stationIcon });
      marker.bindPopup(`
        <div style="font-family: system-ui; padding: 4px;">
          <strong style="color: #1e40af;">📡 ${station.name}</strong><br/>
          <span style="font-size: 12px; color: #666;">Status: ${station.status.toUpperCase()}</span><br/>
          <span style="font-size: 11px; color: #888;">Last: ${new Date(station.last_signal).toLocaleString('id-ID')}</span>
        </div>
      `);
      markersRef.current!.addLayer(marker);
    });

    // Add earthquake markers
    earthquakes.forEach(eq => {
      const size = Math.max(16, eq.magnitude * 6);
      const color = eq.magnitude >= 7 ? '#dc2626' :
                    eq.magnitude >= 6 ? '#ef4444' :
                    eq.magnitude >= 5 ? '#f97316' :
                    eq.magnitude >= 4 ? '#eab308' : '#84cc16';
      
      const isSelected = selectedEarthquake?.id === eq.id;
      
      const eqIcon = L.divIcon({
        className: 'earthquake-marker',
        html: `<div style="
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border: 3px solid ${isSelected ? '#ffffff' : 'rgba(255,255,255,0.6)'};
          border-radius: 50%;
          box-shadow: 0 0 ${isSelected ? '20px' : '10px'} ${color}, 0 0 ${isSelected ? '40px' : '20px'} ${color}40;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${size > 30 ? '11px' : '9px'};
          font-family: system-ui;
          cursor: pointer;
          ${isSelected ? 'animation: pulse-ring 1.5s infinite;' : ''}
        ">${eq.magnitude.toFixed(1)}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([eq.latitude, eq.longitude], { icon: eqIcon });
      marker.on('click', () => onSelectEarthquake(eq));
      marker.bindPopup(`
        <div style="font-family: system-ui; min-width: 200px; padding: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="
              width: 36px;
              height: 36px;
              background: ${color};
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 14px;
            ">${eq.magnitude.toFixed(1)}</div>
            <div>
              <strong style="font-size: 14px; color: #1e293b;">${eq.location}</strong><br/>
              <span style="font-size: 11px; color: #64748b;">${eq.id}</span>
            </div>
          </div>
          <table style="font-size: 12px; width: 100%;">
            <tr><td style="color: #64748b; padding: 2px 8px 2px 0;">Kedalaman:</td><td style="font-weight: 600;">${eq.depth} km</td></tr>
            <tr><td style="color: #64748b; padding: 2px 8px 2px 0;">Waktu:</td><td style="font-weight: 600;">${new Date(eq.timestamp).toLocaleString('id-ID')}</td></tr>
            <tr><td style="color: #64748b; padding: 2px 8px 2px 0;">Koordinat:</td><td style="font-weight: 600;">${eq.latitude.toFixed(4)}, ${eq.longitude.toFixed(4)}</td></tr>
            <tr><td style="color: #64748b; padding: 2px 8px 2px 0;">Tsunami:</td><td style="font-weight: 600; color: ${eq.tsunami_potential ? '#dc2626' : '#22c55e'};">${eq.tsunami_potential ? '⚠️ POTENSI' : '✅ Tidak'}</td></tr>
            ${eq.p_wave_arrival ? `<tr><td style="color: #64748b; padding: 2px 8px 2px 0;">P-wave ETA:</td><td style="font-weight: 600; color: #2563eb;">${eq.p_wave_arrival}s</td></tr>` : ''}
            ${eq.s_wave_arrival ? `<tr><td style="color: #64748b; padding: 2px 8px 2px 0;">S-wave ETA:</td><td style="font-weight: 600; color: #dc2626;">${eq.s_wave_arrival}s</td></tr>` : ''}
          </table>
        </div>
      `);
      markersRef.current!.addLayer(marker);
    });
  }, [earthquakes, stations, selectedEarthquake, onSelectEarthquake]);

  // Focus on selected earthquake
  useEffect(() => {
    if (selectedEarthquake && mapRef.current) {
      mapRef.current.flyTo([selectedEarthquake.latitude, selectedEarthquake.longitude], 8, {
        duration: 1.5,
      });
    }
  }, [selectedEarthquake]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Map overlay info */}
      <div className="absolute top-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-slate-300 font-medium">Peta Satelit - IRIS Geofon Network</span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-12 left-3 z-[1000] bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
        <p className="text-[10px] text-slate-400 font-semibold mb-2 uppercase tracking-wider">Legenda</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full border border-white/50" />
            <span className="text-[10px] text-slate-300">Stasiun Aktif</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full border border-white/50" />
            <span className="text-[10px] text-slate-300">Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full border border-white/50" />
            <span className="text-[10px] text-slate-300">Tidak Aktif</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white/50 flex items-center justify-center text-[7px] text-white font-bold">M</div>
            <span className="text-[10px] text-slate-300">Gempa Bumi</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
}
