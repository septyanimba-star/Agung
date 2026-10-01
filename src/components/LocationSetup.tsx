import { useState, useEffect } from 'react';
import { MapPin, Navigation, X, Check } from 'lucide-react';

interface LocationSetupProps {
  onLocationSet: (lat: number, lon: number, name?: string) => void;
  onClose: () => void;
}

export default function LocationSetup({ onLocationSet, onClose }: LocationSetupProps) {
  const [manualLat, setManualLat] = useState('');
  const [manualLon, setManualLon] = useState('');
  const [locationName, setLocationName] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState('');

  const detectLocation = () => {
    setIsDetecting(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Browser tidak mendukung geolokasi');
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setManualLat(lat.toFixed(6));
        setManualLon(lon.toFixed(6));
        setIsDetecting(false);
      },
      (err) => {
        setError(`Gagal mendeteksi lokasi: ${err.message}`);
        setIsDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = () => {
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);

    if (isNaN(lat) || isNaN(lon)) {
      setError('Masukkan koordinat yang valid');
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setError('Koordinat di luar batas (Lat: -90 to 90, Lon: -180 to 180)');
      return;
    }

    onLocationSet(lat, lon, locationName || 'Lokasi Saya');
  };

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-blue-500 rounded-2xl shadow-2xl shadow-blue-600/30 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900/50 to-blue-800/50 border-b border-blue-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Atur Lokasi Penerima</h2>
                <p className="text-xs text-blue-300">Untuk perhitungan waktu guncangan</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Auto Detect Button */}
          <button
            onClick={detectLocation}
            disabled={isDetecting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isDetecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Mendeteksi lokasi...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                <span>Deteksi Lokasi Otomatis</span>
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-slate-900 text-slate-500">atau masukkan manual</span>
            </div>
          </div>

          {/* Location Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Nama Lokasi (opsional)
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Contoh: Rumah, Kantor, Jakarta"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Manual Coordinates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                placeholder="-6.2088"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={manualLon}
                onChange={(e) => setManualLon(e.target.value)}
                placeholder="106.8456"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-3 py-2 bg-red-900/30 border border-red-700/50 rounded-lg">
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Info */}
          <div className="px-3 py-2 bg-blue-900/20 border border-blue-700/30 rounded-lg">
            <p className="text-[10px] text-blue-300 leading-relaxed">
              💡 Lokasi Anda digunakan untuk menghitung waktu tempuh gelombang S dari episentrum gempa.
              Data lokasi tidak dikirim ke server dan hanya disimpan di browser Anda.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!manualLat || !manualLon}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Lokasi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
