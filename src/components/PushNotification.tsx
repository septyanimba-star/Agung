import { Earthquake } from '../types';
import { AlertTriangle, X, Shield, Clock, MapPin, Waves } from 'lucide-react';

interface PushNotificationProps {
  show: boolean;
  earthquake: Earthquake | null;
  countdown: number;
  onClose: () => void;
}

export default function PushNotification({ show, earthquake, countdown, onClose }: PushNotificationProps) {
  if (!show || !earthquake) return null;

  const isCritical = earthquake.magnitude >= 7.0;
  const isDanger = earthquake.magnitude >= 6.0;
  const isWarning = earthquake.magnitude >= 5.0;

  const getLevelConfig = () => {
    if (isCritical) {
      return {
        bg: 'bg-red-950/95',
        border: 'border-red-500',
        glow: 'shadow-red-600/50',
        text: 'text-red-300',
        accent: 'text-red-400',
        badge: 'bg-red-600',
        pulse: 'animate-critical-pulse',
      };
    }
    if (isDanger) {
      return {
        bg: 'bg-orange-950/95',
        border: 'border-orange-500',
        glow: 'shadow-orange-600/50',
        text: 'text-orange-300',
        accent: 'text-orange-400',
        badge: 'bg-orange-600',
        pulse: 'animate-danger-pulse',
      };
    }
    return {
      bg: 'bg-yellow-950/95',
      border: 'border-yellow-500',
      glow: 'shadow-yellow-600/30',
      text: 'text-yellow-300',
      accent: 'text-yellow-400',
      badge: 'bg-yellow-600',
      pulse: 'animate-warning-pulse',
    };
  };

  const config = getLevelConfig();

  const formatCountdown = (seconds: number) => {
    if (seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercent = () => {
    const maxTime = earthquake.s_wave_arrival || 60;
    return ((maxTime - countdown) / maxTime) * 100;
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      {/* Notification Card */}
      <div className={`relative w-full max-w-lg ${config.bg} ${config.border} border-2 rounded-2xl shadow-2xl ${config.glow} ${config.pulse} overflow-hidden`}>
        {/* Progress bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000 ease-linear"
            style={{ width: `${getProgressPercent()}%` }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors z-10"
        >
          <X className="w-4 h-4 text-slate-300" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full ${config.badge} flex items-center justify-center animate-bounce`}>
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className={`text-lg font-bold ${config.text}`}>
                {isCritical ? '⚠️ PERINGATAN TSUNAMI' : isDanger ? '🚨 GEMPA KUAT' : '⚡ GEMPA TERDETEKSI'}
              </h2>
              <p className="text-xs text-slate-400">Sistem Peringatan Dini InaEEWS</p>
            </div>
          </div>

          {/* Earthquake Info */}
          <div className="bg-slate-900/50 rounded-xl p-4 mb-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${config.accent}`} />
                <span className="text-sm font-bold text-white">{earthquake.location}</span>
              </div>
              <div className={`text-3xl font-bold ${config.accent}`}>
                M{earthquake.magnitude.toFixed(1)}
              </div>
            </div>
            
            <p className="text-xs text-slate-300 mb-3">{earthquake.region}</p>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-800/50 rounded-lg p-2">
                <p className="text-[10px] text-slate-400">Kedalaman</p>
                <p className="text-sm font-bold text-white">{earthquake.depth} km</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <p className="text-[10px] text-slate-400">P-Wave</p>
                <p className="text-sm font-bold text-blue-400">{earthquake.p_wave_arrival}s</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <p className="text-[10px] text-slate-400">S-Wave</p>
                <p className="text-sm font-bold text-red-400">{earthquake.s_wave_arrival}s</p>
              </div>
            </div>

            {earthquake.tsunami_potential && (
              <div className="mt-3 bg-red-900/30 border border-red-700/50 rounded-lg p-2 flex items-center gap-2">
                <Waves className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-xs font-bold text-red-300">POTENSI TSUNAMI - SEGERA EVAKUASI!</span>
              </div>
            )}
          </div>

          {/* Countdown */}
          <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-700/50 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${config.accent} animate-pulse`} />
                <span className="text-xs font-medium text-slate-300">GUNCANGAN DATANG DALAM</span>
              </div>
              <span className={`text-[10px] ${config.accent} font-medium`}>
                S-Wave ETA
              </span>
            </div>
            <div className="text-center">
              <p className={`text-5xl font-bold font-mono ${config.accent} ${countdown <= 10 ? 'animate-pulse' : ''}`}>
                {formatCountdown(countdown)}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">detik</p>
            </div>
          </div>

          {/* Safety Instructions */}
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-blue-300">LANGKAH KESELAMATAN</span>
            </div>
            <ul className="space-y-1.5">
              <li className="text-[11px] text-slate-300 flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">✓</span>
                Lindungi kepala dengan bantal atau helm
              </li>
              <li className="text-[11px] text-slate-300 flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">✓</span>
                Jauhi jendela dan benda yang bisa jatuh
              </li>
              {earthquake.tsunami_potential && (
                <li className="text-[11px] text-red-300 flex items-start gap-2 font-bold">
                  <span className="text-red-400 mt-0.5">⚠</span>
                  SEGERA ke dataran tinggi jika di pantai!
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-900/50 border-t border-slate-700/50 flex items-center justify-between">
          <span className="text-[10px] text-slate-500">
            Data: BMKG & IRIS Geofon
          </span>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 ${config.badge} hover:opacity-90 text-white rounded-lg text-xs font-medium transition-opacity`}
          >
            Mengerti
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes critical-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.5); }
          50% { box-shadow: 0 0 50px rgba(239, 68, 68, 0.8); }
        }
        .animate-critical-pulse {
          animation: critical-pulse 1.5s ease-in-out infinite;
        }
        @keyframes danger-pulse {
          0%, 100% { box-shadow: 0 0 25px rgba(249, 115, 22, 0.4); }
          50% { box-shadow: 0 0 40px rgba(249, 115, 22, 0.6); }
        }
        .animate-danger-pulse {
          animation: danger-pulse 2s ease-in-out infinite;
        }
        @keyframes warning-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(234, 179, 8, 0.3); }
          50% { box-shadow: 0 0 35px rgba(234, 179, 8, 0.5); }
        }
        .animate-warning-pulse {
          animation: warning-pulse 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
