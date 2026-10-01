import { useState } from 'react';
import { StationData } from '../types';
import { ExternalLink, RadioTower, Search, MapPin, X, Cpu, Activity } from 'lucide-react';

interface StationMapProps {
  stations: StationData[];
}

export default function StationMapPanel({ stations }: StationMapProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterSensorType, setFilterSensorType] = useState('all');
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);

  // Get unique regions and sensor types
  const regions = Array.from(new Set(stations.map(s => s.region || 'Unknown'))).sort();
  const sensorTypes = Array.from(new Set(stations.map(s => s.sensor_type || 'Unknown'))).sort();

  // Filter stations
  const filteredStations = stations.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (s.seed_code && s.seed_code.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRegion = filterRegion === 'all' || s.region === filterRegion;
    const matchesSensorType = filterSensorType === 'all' || s.sensor_type === filterSensorType;
    return matchesSearch && matchesRegion && matchesSensorType;
  });

  const getGoogleMapsAllUrl = () => {
    const points = stations
      .filter(s => s.status === 'active')
      .map(s => `${s.latitude},${s.longitude}`)
      .join('/');
    return `https://www.google.com/maps/dir/${points}/@-2.5,118.0,5z`;
  };

  const getGoogleMapsEmbedUrl = (lat?: number, lng?: number, zoom?: number) => {
    const centerLat = lat ?? -2.5;
    const centerLng = lng ?? 118.0;
    const z = zoom ?? 5;
    return `https://maps.google.com/maps?q=${centerLat},${centerLng}&z=${z}&output=embed`;
  };

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

  const getSensorTypeColor = (type?: string) => {
    switch (type) {
      case 'Broadband': return 'bg-blue-900/30 text-blue-400 border-blue-700/50';
      case 'Short-Period': return 'bg-purple-900/30 text-purple-400 border-purple-700/50';
      case 'Strong-Motion': return 'bg-orange-900/30 text-orange-400 border-orange-700/50';
      case 'Accelerometer': return 'bg-pink-900/30 text-pink-400 border-pink-700/50';
      default: return 'bg-slate-800/50 text-slate-400 border-slate-700/50';
    }
  };

  const activeCount = stations.filter(s => s.status === 'active').length;
  const maintenanceCount = stations.filter(s => s.status === 'maintenance').length;
  const inactiveCount = stations.filter(s => s.status === 'inactive').length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700/50">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
          <RadioTower className="w-4 h-4 text-green-400" />
          Sensor Seismograf BMKG
          <span className="text-[10px] text-slate-400 font-normal ml-1">({stations.length} sensor)</span>
        </h2>

        {/* Status summary */}
        <div className="flex items-center gap-3 text-[10px] mb-2">
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
            href={getGoogleMapsAllUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-blue-400 hover:text-blue-300 text-[10px] font-medium"
          >
            <ExternalLink className="w-3 h-3" />
            Semua di Google Maps
          </a>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-2 mb-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Cari stasiun atau SEED code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700/50 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="flex-1 px-2 py-1.5 bg-slate-800 border border-slate-700/50 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="all">Semua Wilayah</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select
            value={filterSensorType}
            onChange={(e) => setFilterSensorType(e.target.value)}
            className="flex-1 px-2 py-1.5 bg-slate-800 border border-slate-700/50 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="all">Semua Tipe Sensor</option>
            {sensorTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Google Maps Embed */}
      <div className="relative flex-shrink-0 border-b border-slate-700/50">
        <iframe
          src={selectedStation 
            ? getGoogleMapsEmbedUrl(selectedStation.latitude, selectedStation.longitude, 10)
            : getGoogleMapsEmbedUrl()
          }
          width="100%"
          height="180"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Peta Sensor BMKG"
          className="w-full"
        />
        {selectedStation && (
          <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-sm rounded-lg px-2 py-1 border border-slate-700/50 flex items-center gap-2">
            <MapPin className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] text-white font-medium">{selectedStation.name}</span>
            <button onClick={() => setSelectedStation(null)} className="text-slate-400 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Station List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredStations.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500">
            Tidak ada sensor ditemukan
          </div>
        ) : (
          filteredStations.map((station) => (
            <div
              key={station.id}
              onClick={() => setSelectedStation(station)}
              className={`px-4 py-2.5 border-b border-slate-800/30 flex items-center gap-2.5 hover:bg-slate-800/30 transition-colors cursor-pointer ${
                selectedStation?.id === station.id ? 'bg-blue-900/20 border-l-2 border-l-blue-500' : ''
              }`}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(station.status)} ${
                station.status === 'active' ? 'animate-pulse' : ''
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-medium text-white truncate">{station.name}</p>
                  {station.seed_code && (
                    <span className="text-[8px] text-slate-500 font-mono">{station.seed_code}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[9px] text-slate-500">{station.latitude.toFixed(3)}°, {station.longitude.toFixed(3)}°</p>
                  {station.sensor_type && (
                    <span className={`text-[8px] px-1.5 py-0.5 rounded border ${getSensorTypeColor(station.sensor_type)}`}>
                      {station.sensor_type}
                    </span>
                  )}
                </div>
              </div>
              <a
                href={`https://www.google.com/maps?q=${station.latitude},${station.longitude}&z=13`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 hover:bg-slate-700 rounded transition-colors flex-shrink-0"
                title="Buka di Google Maps"
              >
                <ExternalLink className="w-3 h-3 text-blue-400" />
              </a>
            </div>
          ))
        )}
      </div>

      {/* Selected Station Detail */}
      {selectedStation && (
        <div className="border-t border-slate-700/50 bg-slate-800/30 p-3 flex-shrink-0 max-h-[200px] overflow-y-auto custom-scrollbar">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-xs font-bold text-white">{selectedStation.name}</h4>
              {selectedStation.seed_code && (
                <p className="text-[9px] text-slate-500 font-mono">SEED: {selectedStation.seed_code} | Network: {selectedStation.network}</p>
              )}
            </div>
            <button onClick={() => setSelectedStation(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[9px]">
            <div>
              <p className="text-slate-500">Tipe Sensor:</p>
              <p className="text-white font-medium">{selectedStation.sensor_type || '-'}</p>
            </div>
            <div>
              <p className="text-slate-500">Model:</p>
              <p className="text-white font-medium text-[8px]">{selectedStation.sensor_model || '-'}</p>
            </div>
            <div>
              <p className="text-slate-500">Sampling Rate:</p>
              <p className="text-white font-medium">{selectedStation.sampling_rate ? `${selectedStation.sampling_rate} Hz` : '-'}</p>
            </div>
            <div>
              <p className="text-slate-500">Elevasi:</p>
              <p className="text-white font-medium">{selectedStation.elevation ? `${selectedStation.elevation} m` : '-'}</p>
            </div>
            <div>
              <p className="text-slate-500">Status:</p>
              <p className={`font-medium ${
                selectedStation.status === 'active' ? 'text-green-400' :
                selectedStation.status === 'maintenance' ? 'text-yellow-400' : 'text-red-400'
              }`}>{getStatusLabel(selectedStation.status)}</p>
            </div>
            <div>
              <p className="text-slate-500">Terpasang:</p>
              <p className="text-white font-medium text-[8px]">{selectedStation.installation_date || '-'}</p>
            </div>
          </div>

          {selectedStation.channels && (
            <div className="mt-2">
              <p className="text-[9px] text-slate-500 mb-1">Channels:</p>
              <div className="flex gap-1">
                {selectedStation.channels.map(ch => (
                  <span key={ch} className="text-[8px] px-1.5 py-0.5 bg-slate-700/50 text-slate-300 rounded">
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          )}

          <a
            href={`https://www.google.com/maps?q=${selectedStation.latitude},${selectedStation.longitude}&z=13`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-1.5 w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-medium transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Buka di Google Maps
          </a>
        </div>
      )}
    </div>
  );
}
