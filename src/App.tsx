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
import { Bell, BellOff, X, ChevronDown, ChevronUp, RefreshCw, Map } from 'lucide-react';

export default function App() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>(recentEarthquakes);
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'earthquakes' | 'warnings' | 'stations' | 'gmap'>('earthquakes');
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showGmapModal, setShowGmapModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newQuake = generateNewEarthquake();
        setEarthquakes(prev => [newQuake, ...prev].slice(0, 30));
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
    if (window.innerWidth < 1024) setShowMobilePanel(true);
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

      {/* Google Maps Full Modal */}
      {showGmapModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-700/50 w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-5 py-3 border-b border-slate-700/50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Map className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Peta Google - 100 Stasiun BMKG</h3>
                  <p className="text-[10px] text-slate-400">Jaringan Monitoring Seismik Indonesia</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/place/Indonesia/@-2.5,118.0,5z`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Buka Google Maps
                </a>
                <button
                  onClick={() => setShowGmapModal(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-300" />
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              <iframe
                src="https://maps.google.com/maps?q=Indonesia&z=5&output=embed"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Google Full - Stasiun BMKG"
              />
              {/* Quick region links */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                {[
                  { name: '🏝️ Maluku', lat: -3.5, lng: 128 },
                  { name: '🌋 Sulut', lat: 1.3, lng: 124.8 },
                  { name: '🗻 Jawa', lat: -7.0, lng: 110.0 },
                  { name: '🌊 Sumatera', lat: 0.0, lng: 100.0 },
                  { name: '🏔️ Papua', lat: -2.5, lng: 138.0 },
                  { name: '🌴 NTT', lat: -10.0, lng: 123.0 },
                ].map(region => (
                  <a
                    key={region.name}
                    href={`https://www.google.com/maps/@${region.lat},${region.lng},7z`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-full text-[10px] text-white font-medium hover:bg-slate-800 transition-colors"
                  >
                    {region.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left Panel - Map */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Stats Bar */}
          <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800/50 flex-shrink-0">
            <StatsPanel
              earthquakes={earthquakes}
              stationCount={monitoringStations.length}
              activeStationCount={activeStationCount}
            />
          </div>

          {/* Main Map */}
          <div className="flex-1 p-4 min-h-[350px]">
            <MapView
              earthquakes={earthquakes}
              stations={monitoringStations}
              selectedEarthquake={selectedEarthquake}
              onSelectEarthquake={handleSelectEarthquake}
            />
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
          {/* Mobile close */}
          <button
            onClick={() => setShowMobilePanel(false)}
            className="lg:hidden absolute top-2 right-2 z-10 p-2 bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-700/50 flex-shrink-0">
            <button
              onClick={() => setActiveTab('earthquakes')}
              className={`flex-1 px-2 py-2.5 text-[10px] font-medium transition-colors ${
                activeTab === 'earthquakes'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-900/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🌊 Gempa
            </button>
            <button
              onClick={() => setActiveTab('warnings')}
              className={`flex-1 px-2 py-2.5 text-[10px] font-medium transition-colors ${
                activeTab === 'warnings'
                  ? 'text-red-400 border-b-2 border-red-400 bg-red-900/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🚨 Peringatan
              <span className="ml-0.5 inline-flex items-center justify-center w-4 h-4 text-[8px] bg-red-600 text-white rounded-full">
                {warningAlerts.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('stations')}
              className={`flex-1 px-2 py-2.5 text-[10px] font-medium transition-colors ${
                activeTab === 'stations'
                  ? 'text-green-400 border-b-2 border-green-400 bg-green-900/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📡 Stasiun
            </button>
            <button
              onClick={() => setActiveTab('gmap')}
              className={`flex-1 px-2 py-2.5 text-[10px] font-medium transition-colors ${
                activeTab === 'gmap'
                  ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-900/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🗺️ Peta
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'earthquakes' && (
              <EarthquakeList
                earthquakes={earthquakes}
                selectedId={selectedEarthquake?.id || null}
                onSelect={handleSelectEarthquake}
              />
            )}
            {activeTab === 'warnings' && (
              <WarningPanel alerts={warningAlerts} />
            )}
            {activeTab === 'stations' && (
              <StationMapPanel stations={monitoringStations} />
            )}
            {activeTab === 'gmap' && (
              <GoogleMapsTab />
            )}
          </div>

          {/* Bottom Controls */}
          <div className="px-4 py-3 border-t border-slate-700/50 bg-slate-900/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-slate-400">
                  IRIS Geofon • {formatLastUpdate()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/50 hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                    notifications
                      ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                      : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                  }`}
                >
                  {notifications ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
                  {notifications ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setShowMobilePanel(!showMobilePanel)}
        className="lg:hidden fixed bottom-6 right-6 z-[9997] w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full shadow-2xl shadow-blue-900/50 flex items-center justify-center transition-all duration-300 active:scale-95"
      >
        {showMobilePanel ? <ChevronDown className="w-6 h-6 text-white" /> : <ChevronUp className="w-6 h-6 text-white" />}
      </button>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-800/50 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>Data: BMKG & IRIS Geofon | InaEEWS v3.0</span>
          <span className="hidden sm:inline">{monitoringStations.length} stasiun • {earthquakes.length} event • Sulawesi Utara & Maluku prioritized</span>
          <span>© 2026 InaEEWS</span>
        </div>
      </footer>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
}

// Google Maps Tab - lightweight, loads only when clicked
function GoogleMapsTab() {
  const [loaded, setLoaded] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const regions = [
    { id: 'sulut', name: 'Sulawesi Utara', emoji: '🌋', lat: 1.3, lng: 124.8, zoom: 8, count: 18 },
    { id: 'maluku', name: 'Maluku', emoji: '🏝️', lat: -3.5, lng: 128.0, zoom: 7, count: 20 },
    { id: 'sulteng', name: 'Sulawesi Tengah', emoji: '🗻', lat: -0.9, lng: 119.9, zoom: 8, count: 6 },
    { id: 'sulsel', name: 'Sulawesi Selatan', emoji: '⛰️', lat: -5.1, lng: 119.4, zoom: 8, count: 5 },
    { id: 'jawa', name: 'Jawa', emoji: '🏙️', lat: -7.0, lng: 110.0, zoom: 7, count: 12 },
    { id: 'sumatera', name: 'Sumatera', emoji: '🌊', lat: 0.0, lng: 100.0, zoom: 6, count: 10 },
    { id: 'papua', name: 'Papua', emoji: '🏔️', lat: -2.5, lng: 138.0, zoom: 6, count: 6 },
    { id: 'ntt', name: 'NTT', emoji: '🌴', lat: -10.0, lng: 123.0, zoom: 7, count: 5 },
    { id: 'bali-ntb', name: 'Bali & NTB', emoji: '🏖️', lat: -8.5, lng: 116.0, zoom: 8, count: 5 },
    { id: 'kalimantan', name: 'Kalimantan', emoji: '🌳', lat: -1.0, lng: 115.0, zoom: 6, count: 5 },
  ];

  const getEmbedUrl = () => {
    if (selectedRegion) {
      const r = regions.find(r => r.id === selectedRegion);
      if (r) return `https://maps.google.com/maps?q=${r.lat},${r.lng}&z=${r.zoom}&output=embed`;
    }
    return `https://maps.google.com/maps?q=Indonesia&z=5&output=embed`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-700/50 flex-shrink-0">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
          <Map className="w-4 h-4 text-purple-400" />
          Peta Google Maps
        </h2>
        <p className="text-[10px] text-slate-400">Pilih wilayah untuk zoom atau lihat seluruh Indonesia</p>
        
        {/* Region buttons */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <button
            onClick={() => setSelectedRegion(null)}
            className={`px-2 py-1 rounded-full text-[9px] font-medium transition-colors ${
              !selectedRegion ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🇮🇩 Semua
          </button>
          {regions.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRegion(r.id)}
              className={`px-2 py-1 rounded-full text-[9px] font-medium transition-colors ${
                selectedRegion === r.id ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {r.emoji} {r.name} ({r.count})
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-400">Memuat Google Maps...</p>
            </div>
          </div>
        )}
        <iframe
          key={selectedRegion || 'all'}
          src={getEmbedUrl()}
          className="w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Peta Google Maps BMKG"
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* Open in Google Maps button */}
      <div className="px-4 py-2 border-t border-slate-700/50 flex-shrink-0">
        <a
          href={selectedRegion 
            ? `https://www.google.com/maps/@${regions.find(r => r.id === selectedRegion)?.lat},${regions.find(r => r.id === selectedRegion)?.lng},${regions.find(r => r.id === selectedRegion)?.zoom}z`
            : 'https://www.google.com/maps/place/Indonesia/@-2.5,118.0,5z'
          }
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Buka di Google Maps
          {selectedRegion && ` - ${regions.find(r => r.id === selectedRegion)?.name}`}
        </a>
      </div>
    </div>
  );
}
