import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import EarthquakeList from './components/EarthquakeList';
import WarningPanel from './components/WarningPanel';
import StatsPanel from './components/StatsPanel';
import SeismicVisualizer from './components/SeismicVisualizer';
import StationMapPanel from './components/StationMapPanel';
import { recentEarthquakes, warningAlerts, monitoringStations, generateNewEarthquake } from './data/earthquakes';
import { Earthquake } from './types';
import { Bell, BellOff, X, ChevronDown, ChevronUp, RefreshCw, RadioTower } from 'lucide-react';

export default function App() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>(recentEarthquakes);
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'earthquakes' | 'warnings' | 'stations'>('earthquakes');
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  

  // Simulate real-time earthquake detection
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newQuake = generateNewEarthquake();
        
        setEarthquakes(prev => {
          const updated = [newQuake, ...prev];
          return updated.slice(0, 30);
        });

        if (notifications && newQuake.magnitude >= 5) {
          setNotificationMessage(`Gempa M${newQuake.magnitude.toFixed(1)} terdeteksi di ${newQuake.location}`);
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 6000);
        }

        setLastUpdate(new Date());
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [notifications]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newQuake = generateNewEarthquake();
      setEarthquakes(prev => [newQuake, ...prev].slice(0, 30));
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const handleSelectEarthquake = (eq: Earthquake) => {
    setSelectedEarthquake(eq);
    if (window.innerWidth < 1024) {
      setShowMobilePanel(true);
    }
  };

  const activeStationCount = monitoringStations.filter(s => s.status === 'active').length;

  const formatLastUpdate = () => {
    const diff = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
    if (diff < 60) return `${diff}s lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
    return `${Math.floor(diff / 3600)}j lalu`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Header />
      
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-[9999] animate-slide-in">
          <div className="bg-slate-800 border border-orange-600/50 rounded-xl p-4 shadow-2xl shadow-orange-900/30 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-600/20 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-orange-400 animate-bounce" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange-300">🔔 Gempa Baru Terdeteksi!</p>
                <p className="text-xs text-slate-300 mt-0.5">{notificationMessage}</p>
                <p className="text-[10px] text-slate-500 mt-1">Data: IRIS Geofon / BMKG</p>
              </div>
              <button onClick={() => setShowNotification(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left Panel - Map & Stations */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
          {/* Stats Bar */}
          <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800/50 flex-shrink-0">
            <StatsPanel
              earthquakes={earthquakes}
              stationCount={monitoringStations.length}
              activeStationCount={activeStationCount}
            />
          </div>

          {/* Main Map */}
          <div className="flex-1 p-4 min-h-[400px] flex-shrink-0">
            <MapView
              earthquakes={earthquakes}
              stations={monitoringStations}
              selectedEarthquake={selectedEarthquake}
              onSelectEarthquake={handleSelectEarthquake}
            />
          </div>

          {/* Station Map Panel - Google Maps */}
          <div className="px-4 pb-4 flex-shrink-0">
            <StationMapPanel stations={monitoringStations} />
          </div>

          {/* Seismic Visualizer */}
          <div className="px-4 pb-4 flex-shrink-0">
            <SeismicVisualizer earthquake={selectedEarthquake} />
          </div>
        </div>

        {/* Right Panel - Data */}
        <div className={`
          w-full lg:w-96 xl:w-[420px] flex flex-col border-l border-slate-800/50 bg-slate-900/30
          ${showMobilePanel ? 'fixed inset-0 z-[9998] lg:relative lg:inset-auto' : 'hidden lg:flex'}
        `}>
          {/* Mobile close button */}
          <button
            onClick={() => setShowMobilePanel(false)}
            className="lg:hidden absolute top-2 right-2 z-10 p-2 bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-700/50">
            <button
              onClick={() => setActiveTab('earthquakes')}
              className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
                activeTab === 'earthquakes'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-900/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Gempa
            </button>
            <button
              onClick={() => setActiveTab('warnings')}
              className={`flex-1 px-3 py-3 text-xs font-medium transition-colors relative ${
                activeTab === 'warnings'
                  ? 'text-red-400 border-b-2 border-red-400 bg-red-900/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Peringatan
              <span className="ml-1 inline-flex items-center justify-center w-4 h-4 text-[9px] bg-red-600 text-white rounded-full">
                {warningAlerts.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('stations')}
              className={`flex-1 px-3 py-3 text-xs font-medium transition-colors relative ${
                activeTab === 'stations'
                  ? 'text-green-400 border-b-2 border-green-400 bg-green-900/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <RadioTower className="w-3.5 h-3.5 inline mr-1" />
              Stasiun
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'earthquakes' ? (
              <EarthquakeList
                earthquakes={earthquakes}
                selectedId={selectedEarthquake?.id || null}
                onSelect={handleSelectEarthquake}
              />
            ) : activeTab === 'warnings' ? (
              <WarningPanel alerts={warningAlerts} />
            ) : (
              <StationListTab stations={monitoringStations} />
            )}
          </div>

          {/* Bottom Controls */}
          <div className="px-4 py-3 border-t border-slate-700/50 bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-slate-400">
                  IRIS Geofon • {formatLastUpdate()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/50 hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    notifications
                      ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                      : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                  }`}
                >
                  {notifications ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                  {notifications ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setShowMobilePanel(!showMobilePanel)}
        className="lg:hidden fixed bottom-6 right-6 z-[9997] w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full shadow-2xl shadow-blue-900/50 flex items-center justify-center transition-all duration-300 active:scale-95"
      >
        {showMobilePanel ? (
          <ChevronDown className="w-6 h-6 text-white" />
        ) : (
          <ChevronUp className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-800/50 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>Data: BMKG & IRIS Geofon | InaEEWS v2.3.0</span>
          <span className="hidden sm:inline">Sistem Peringatan Dini Gempa Bumi Indonesia • {earthquakes.length} event • {monitoringStations.length} stasiun</span>
          <span>© 2026 InaEEWS</span>
        </div>
      </footer>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
}

// Station List Tab Component
function StationListTab({ stations }: { stations: typeof monitoringStations }) {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

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

  const getGoogleMapsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps?q=${lat},${lng}&z=14&satellite=true`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <RadioTower className="w-4 h-4 text-green-400" />
          Stasiun BMKG
        </h2>
        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
          {stations.length} stasiun
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {stations.map((station) => (
          <div
            key={station.id}
            onClick={() => setSelectedStation(selectedStation === station.id ? null : station.id)}
            className={`px-4 py-3 border-b border-slate-800/30 cursor-pointer transition-all hover:bg-slate-800/30 ${
              selectedStation === station.id ? 'bg-green-900/10 border-l-2 border-l-green-500' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(station.status)} ${
                station.status === 'active' ? 'animate-pulse' : ''
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white">{station.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {station.latitude.toFixed(4)}°, {station.longitude.toFixed(4)}°
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                  station.status === 'active' ? 'bg-green-900/30 text-green-400' :
                  station.status === 'maintenance' ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-red-900/30 text-red-400'
                }`}>
                  {getStatusLabel(station.status)}
                </span>
                <a
                  href={getGoogleMapsUrl(station.latitude, station.longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 bg-blue-900/30 hover:bg-blue-800/50 rounded-lg transition-colors"
                  title="Lihat di Google Maps"
                >
                  <svg className="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Expanded detail */}
            {selectedStation === station.id && (
              <div className="mt-3 pl-6 space-y-2">
                <div className="flex items-center gap-4 text-[10px] text-slate-400">
                  <span>📡 ID: {station.id}</span>
                  <span>🕐 Last: {new Date(station.last_signal).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</span>
                </div>
                
                {/* Mini Google Maps embed */}
                <div className="rounded-lg overflow-hidden border border-slate-700/50">
                  <iframe
                    src={`https://maps.google.com/maps?q=${station.latitude},${station.longitude}&z=13&output=embed`}
                    width="100%"
                    height="120"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Peta ${station.name}`}
                  />
                </div>

                <a
                  href={getGoogleMapsUrl(station.latitude, station.longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-medium transition-colors"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Buka di Google Maps
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
