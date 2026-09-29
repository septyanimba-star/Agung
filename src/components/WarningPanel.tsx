import { useState, useEffect } from 'react';
import { WarningAlert } from '../types';
import { AlertTriangle, Shield, Info, Volume2, VolumeX } from 'lucide-react';

interface WarningPanelProps {
  alerts: WarningAlert[];
}

export default function WarningPanel({ alerts }: WarningPanelProps) {
  const [muted, setMuted] = useState(false);
  const [countdowns, setCountdowns] = useState<Record<string, number>>({});

  useEffect(() => {
    // Initialize countdowns
    const initial: Record<string, number> = {};
    alerts.forEach(alert => {
      if (alert.estimated_arrival) {
        initial[alert.id] = alert.estimated_arrival;
      }
    });
    setCountdowns(initial);

    const timer = setInterval(() => {
      setCountdowns(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key] > 0) {
            updated[key] = updated[key] - 1;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [alerts]);

  const getLevelStyles = (level: string) => {
    switch (level) {
      case 'critical':
        return {
          bg: 'bg-red-950/80 border-red-600/70',
          icon: <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />,
          badge: 'bg-red-600 text-white animate-pulse',
          title: 'text-red-300',
          text: 'text-red-200',
          glow: 'shadow-red-900/50',
        };
      case 'danger':
        return {
          bg: 'bg-orange-950/80 border-orange-600/70',
          icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
          badge: 'bg-orange-600 text-white',
          title: 'text-orange-300',
          text: 'text-orange-200',
          glow: 'shadow-orange-900/30',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-950/60 border-yellow-600/50',
          icon: <Shield className="w-5 h-5 text-yellow-400" />,
          badge: 'bg-yellow-600 text-slate-900',
          title: 'text-yellow-300',
          text: 'text-yellow-200',
          glow: 'shadow-yellow-900/20',
        };
      default:
        return {
          bg: 'bg-blue-950/60 border-blue-600/50',
          icon: <Info className="w-5 h-5 text-blue-400" />,
          badge: 'bg-blue-600 text-white',
          title: 'text-blue-300',
          text: 'text-blue-200',
          glow: 'shadow-blue-900/20',
        };
    }
  };

  const formatCountdown = (seconds: number) => {
    if (seconds <= 0) return 'TERKIRIM';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          Peringatan Dini
        </h2>
        <button
          onClick={() => setMuted(!muted)}
          className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
          title={muted ? 'Aktifkan suara' : 'Matikan suara'}
        >
          {muted ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-green-400" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {alerts.map((alert) => {
          const styles = getLevelStyles(alert.level);
          const countdown = countdowns[alert.id];

          return (
            <div
              key={alert.id}
              className={`rounded-xl border p-4 shadow-lg transition-all duration-300 ${styles.bg} ${styles.glow} ${
                alert.level === 'critical' ? 'animate-subtle-pulse' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {styles.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${styles.badge}`}>
                      {alert.level}
                    </span>
                    <h3 className={`text-sm font-bold ${styles.title}`}>
                      {alert.title}
                    </h3>
                  </div>
                  
                  <p className={`text-xs ${styles.text} leading-relaxed`}>
                    {alert.message}
                  </p>

                  {countdown !== undefined && countdown > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 bg-slate-800/80 rounded-lg p-2 border border-slate-700/50">
                        <p className="text-[10px] text-slate-400 mb-0.5">S-Wave ETA (Guncangan)</p>
                        <p className="text-lg font-mono font-bold text-red-400">
                          {formatCountdown(countdown)}
                        </p>
                      </div>
                      <div className="flex-1 bg-slate-800/80 rounded-lg p-2 border border-slate-700/50">
                        <p className="text-[10px] text-slate-400 mb-0.5">Status</p>
                        <p className="text-xs font-bold text-green-400">
                          ⚡ DETEKSI AKTIF
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">
                      {new Date(alert.timestamp).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Safety tips */}
        <div className="mt-4 bg-slate-800/50 rounded-xl border border-slate-700/30 p-4">
          <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            Tips Keselamatan
          </h4>
          <ul className="space-y-1.5">
            <li className="text-[11px] text-slate-400 flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              Jika merasakan guncangan, lindungi kepala dengan bantal atau helm
            </li>
            <li className="text-[11px] text-slate-400 flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              Jauhi jendela, rak buku, dan benda yang bisa jatuh
            </li>
            <li className="text-[11px] text-slate-400 flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              Jika di pantai dan gempa kuat, segera ke dataran tinggi
            </li>
            <li className="text-[11px] text-slate-400 flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              Siapkan tas siaga bencana dengan dokumen penting
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes subtle-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        .animate-subtle-pulse {
          animation: subtle-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
