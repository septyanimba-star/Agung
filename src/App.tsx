import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import EarthquakeList from './components/EarthquakeList';
import WarningPanel from './components/WarningPanel';
import StatsPanel from './components/StatsPanel';
import SeismicVisualizer from './components/SeismicVisualizer';
import { recentEarthquakes, warningAlerts, monitoringStations, generateNewEarthquake } from './data/earthquakes';
import { Earthquake } from './types';
import { Bell, BellOff, X, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

export default function App() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>(recentEarthquakes);
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'earthquakes' | 'warnings'>('earthquakes');
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time earthquake detection with new data
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newQuake = generateNewEarthquake();
        
        setEarthquakes(prev => {
          const updated = [newQuake, ...prev];
          // Keep max 30 earthquakes
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

  // Manual refresh
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
        {/* Left Panel - Map */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Stats Bar */}
          <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800/50">
            <StatsPanel
              earthquakes={earthquakes}
              stationCount={monitoringStations.length}
              activeStationCount={activeStationCount}
            />
          </div>

          {/* Map */}
          <div className="flex-1 p-4 min-h-[400px]">
            <MapView
              earthquakes={earthquakes}
              stations={monitoringStations}
              selectedEarthquake={selectedEarthquake}
              onSelectEarthquake={handleSelectEarthquake}
            />
          </div>

          {/* Seismic Visualizer - below map on desktop */}
          <div className="px-4 pb-4 hidden lg:block">
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
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'earthquakes'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-900/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Data Gempa
            </button>
            <button
              onClick={() => setActiveTab('warnings')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'warnings'
                  ? 'text-red-400 border-b-2 border-red-400 bg-red-900/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Peringatan
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-[10px] bg-red-600 text-white rounded-full">
                {warningAlerts.length}
              </span>
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
            ) : (
              <WarningPanel alerts={warningAlerts} />
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
      <footer className="bg-slate-900/80 border-t border-slate-800/50 px-4 py-2">
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>Data: BMKG & IRIS Geofon | InaEEWS v2.2.0</span>
          <span className="hidden sm:inline">Sistem Peringatan Dini Gempa Bumi Indonesia • {earthquakes.length} event dimonitor</span>
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
