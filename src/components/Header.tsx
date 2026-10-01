import { useState, useEffect } from 'react';
import { AlertTriangle, Activity, Radio, Clock } from 'lucide-react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertCount, setAlertCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate alert count changes
    const interval = setInterval(() => {
      setAlertCount(prev => Math.max(1, prev + (Math.random() > 0.7 ? 1 : 0)));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-blue-800/50 shadow-lg shadow-blue-900/20">
      <div className="max-w-full mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Activity className="w-8 h-8 text-red-500 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Indonesia Gempa Bumi
                </h1>
                <p className="text-[10px] text-blue-300 -mt-1 tracking-wider">
                  SISTEM PERINGATAN DINI GEMPA BUMI
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-1 ml-4 px-3 py-1 bg-green-900/30 border border-green-700/50 rounded-full">
              <Radio className="w-3 h-3 text-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">LIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-blue-200">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-mono">
                {currentTime.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB
              </span>
            </div>

            <div className="flex items-center gap-1 px-3 py-1.5 bg-red-900/40 border border-red-700/50 rounded-lg cursor-pointer hover:bg-red-900/60 transition-colors">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-bold text-red-300">{alertCount}</span>
              <span className="text-xs text-red-400 hidden sm:inline">Alert Aktif</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
