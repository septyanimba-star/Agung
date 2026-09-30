import { useState } from 'react';
import { StationData } from '../types';
import { MapPin, ExternalLink, Radio, RadioTower, Map, X, Navigation } from 'lucide-react';

interface StationMapProps {
  stations: StationData[];
}

export default function StationMapPanel({ stations }: StationMapProps) {
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'maintenance': return 'Maintenance';
      case 'inactive': return 'Tidak Aktif';
      default: return status;
    }
  };

  const getGoogleMapsUrl = (lat: number, lng: number, name: string) => {
    return `https://www.google.com/maps?q=${lat},${lng}&z=12&satellite=true`;
  };

  const getGoogleMapsEmbedUrl = (lat: number, lng: number) => {
    return `https://maps.google.com/maps?q=${lat},${lng}&z=5&output=embed&satellite=true`;
  };

  const getGoogleMapsDirectionsUrl = (stations: StationData[]) => {
    const activeStations = stations.filter(s => s.status === 'active');
    const path = activeStations.map(s => `${s.latitude},${s.longitude}`).join('/');
    return `https://www.google.com/maps/dir/${path}`;
  };

  const getGoogleMapsAreaUrl = () => {
    // Show all stations in one view
    return `https://www.google.com/maps/place/Indonesia/@-2.5,118.0,5z`;
  };

  const activeCount = stations.filter(s => s.status === 'active').length;
  const maintenanceCount = stations.filter(s => s.status === 'maintenance').length;
  const inactiveCount = stations.filter(s => s.status === 'inactive').length;

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <RadioTower className="w-4 h-4 text-green-400" />
          Peta Stasiun BMKG - Google Maps
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('map')}
            className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
              viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Map className="w-3 h-3 inline mr-1" />
            Peta
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
              viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Radio className="w-3 h-3 inline mr-1" />
            Daftar
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="px-4 py-2 border-b border-slate-800/50 flex items-center gap-4 text-[10px]">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-green-400">{activeCount} Aktif</span>
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
          <span className="text-yellow-400">{maintenanceCount} Maintenance</span>
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span className="text-red-400">{inactiveCount} Tidak Aktif</span>
        </span>
        <a
          href={getGoogleMapsAreaUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Buka di Google Maps
        </a>
      </div>

      {viewMode === 'map' ? (
        <div className="relative">
          {/* Google Maps Embed */}
          <div className="aspect-video w-full">
            <iframe
              src={getGoogleMapsEmbedUrl(-2.5, 118.0)}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Stasiun BMKG - Google Maps"
            />
          </div>

          {/* Overlay info */}
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700/50">
            <p className="text-[10px] text-slate-300 font-medium">
              📡 {stations.length} Stasiun Seismik BMKG
            </p>
            <p className="text-[9px] text-slate-500">Indonesia Earthquake Monitoring Network</p>
          </div>

          {/* Quick links */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
            <a
              href={getGoogleMapsAreaUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-medium flex items-center gap-1.5 shadow-lg transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Lihat Semua di Google Maps
            </a>
            <a
              href={getGoogleMapsDirectionsUrl(stations)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-medium flex items-center gap-1.5 shadow-lg transition-colors"
            >
              <Navigation className="w-3 h-3" />
              Rute Semua Stasiun
            </a>
          </div>
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          {stations.map((station) => (
            <div
              key={station.id}
              className={`px-4 py-2.5 border-b border-slate-800/30 flex items-center gap-3 hover:bg-slate-800/30 transition-colors cursor-pointer ${
                selectedStation?.id === station.id ? 'bg-blue-900/20 border-l-2 border-l-blue-500' : ''
              }`}
              onClick={() => setSelectedStation(station)}
            >
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getStatusColor(station.status)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{station.name}</p>
                <p className="text-[10px] text-slate-500">
                  {station.latitude.toFixed(4)}°, {station.longitude.toFixed(4)}°
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                  station.status === 'active' ? 'bg-green-900/30 text-green-400' :
                  station.status === 'maintenance' ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-red-900/30 text-red-400'
                }`}>
                  {getStatusLabel(station.status)}
                </span>
                <a
                  href={getGoogleMapsUrl(station.latitude, station.longitude, station.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 hover:bg-slate-700 rounded transition-colors"
                  title="Lihat di Google Maps"
                >
                  <ExternalLink className="w-3 h-3 text-blue-400" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Station Detail */}
      {selectedStation && viewMode === 'list' && (
        <div className="px-4 py-3 border-t border-slate-700/50 bg-slate-800/30">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                {selectedStation.name}
              </h4>
              <div className="mt-1 space-y-0.5">
                <p className="text-[11px] text-slate-400">
                  Koordinat: {selectedStation.latitude.toFixed(4)}°, {selectedStation.longitude.toFixed(4)}°
                </p>
                <p className="text-[11px] text-slate-400">
                  Status: <span className={
                    selectedStation.status === 'active' ? 'text-green-400' :
                    selectedStation.status === 'maintenance' ? 'text-yellow-400' : 'text-red-400'
                  }>{getStatusLabel(selectedStation.status)}</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Signal terakhir: {new Date(selectedStation.last_signal).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB
                </p>
              </div>
            </div>
            <button onClick={() => setSelectedStation(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            <a
              href={getGoogleMapsUrl(selectedStation.latitude, selectedStation.longitude, selectedStation.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Buka di Google Maps
            </a>
            <a
              href={`https://www.google.com/maps/dir/${selectedStation.latitude},${selectedStation.longitude}/@${selectedStation.latitude},${selectedStation.longitude},14z/data=!3m1!4b1`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-[11px] font-medium transition-colors"
            >
              <Navigation className="w-3 h-3" />
              Navigasi
            </a>
          </div>

          {/* Mini Google Maps embed for selected station */}
          <div className="mt-3 rounded-lg overflow-hidden border border-slate-700/50">
            <iframe
              src={`https://maps.google.com/maps?q=${selectedStation.latitude},${selectedStation.longitude}&z=13&output=embed`}
              width="100%"
              height="150"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Peta ${selectedStation.name}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
