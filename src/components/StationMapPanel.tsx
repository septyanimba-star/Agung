import { useState } from 'react';
import { StationData } from '../types';
import { ExternalLink, RadioTower, Search, MapPin, X } from 'lucide-react';

interface StationMapProps {
  stations: StationData[];
}

export default function StationMapPanel({ stations }: StationMapProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);

  // Get regions from stations
  const regions = Array.from(new Set(stations.map(s => {
    const parts = s.id.split('-');
    return parts.length >= 2 ? parts[1] : 'OTHER';
  }))).sort();

  const regionLabels: Record<string, string> = {
    'SUT': 'Sulawesi Utara',
    'MLK': 'Maluku',
    'STG': 'Sulawesi Tengah',
    'SSL': 'Sulawesi Selatan',
    'STR': 'Sulawesi Tenggara',
    'GOR': 'Gorontalo',
    'JW': 'Jawa',
    'SM': 'Sumatera',
    'BNTB': 'Bali & NTB',
    'NTT': 'NTT',
    'KL': 'Kalimantan',
    'PP': 'Papua',
  };

  // Filter stations
  const filteredStations = stations.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = filterRegion === 'all' || s.id.includes(`-${filterRegion}-`);
    return matchesSearch && matchesRegion;
  });

  const getGoogleMapsAllUrl = () => {
    // Create a Google Maps URL with multiple markers using path parameter
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

  const activeCount = stations.filter(s => s.status === 'active').length;
  const maintenanceCount = stations.filter(s => s.status === 'maintenance').length;
  const inactiveCount = stations.filter(s => s.status === 'inactive').length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700/50">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
          <RadioTower className="w-4 h-4 text-green-400" />
          Peta Stasiun BMKG
          <span className="text-[10px] text-slate-400 font-normal ml-1">({stations.length} stasiun)</span>
        </h2>

        {/* Status summary */}
        <div className="flex items-center gap-3 text-[10px] mb-2">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-green-400">{activeCount}</span>
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span className="text-yellow-400">{maintenanceCount}</span>
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-red-400">{inactiveCount}</span>
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

        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Cari stasiun..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700/50 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="px-2 py-1.5 bg-slate-800 border border-slate-700/50 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="all">Semua Wilayah</option>
            {regions.map(r => (
              <option key={r} value={r}>{regionLabels[r] || r}</option>
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
          title="Peta Stasiun BMKG"
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
            Tidak ada stasiun ditemukan
          </div>
        ) : (
          filteredStations.map((station) => (
            <div
              key={station.id}
              onClick={() => setSelectedStation(station)}
              className={`px-4 py-2 border-b border-slate-800/30 flex items-center gap-2.5 hover:bg-slate-800/30 transition-colors cursor-pointer ${
                selectedStation?.id === station.id ? 'bg-blue-900/20 border-l-2 border-l-blue-500' : ''
              }`}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(station.status)} ${
                station.status === 'active' ? 'animate-pulse' : ''
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-white truncate">{station.name}</p>
                <p className="text-[9px] text-slate-500">{station.latitude.toFixed(3)}°, {station.longitude.toFixed(3)}°</p>
              </div>
              <span className={`text-[8px] px-1.5 py-0.5 rounded flex-shrink-0 ${
                station.status === 'active' ? 'bg-green-900/30 text-green-400' :
                station.status === 'maintenance' ? 'bg-yellow-900/30 text-yellow-400' :
                'bg-red-900/30 text-red-400'
              }`}>
                {getStatusLabel(station.status)}
              </span>
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
    </div>
  );
}
