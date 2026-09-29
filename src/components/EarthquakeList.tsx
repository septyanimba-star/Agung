import { Earthquake } from '../types';
import { MapPin, Clock, Waves, AlertTriangle } from 'lucide-react';

interface EarthquakeListProps {
  earthquakes: Earthquake[];
  selectedId: string | null;
  onSelect: (eq: Earthquake) => void;
}

export default function EarthquakeList({ earthquakes, selectedId, onSelect }: EarthquakeListProps) {
  const getMagnitudeColor = (mag: number) => {
    if (mag >= 7) return 'bg-red-600 text-white';
    if (mag >= 6) return 'bg-red-500 text-white';
    if (mag >= 5) return 'bg-orange-500 text-white';
    if (mag >= 4) return 'bg-yellow-500 text-slate-900';
    return 'bg-lime-500 text-slate-900';
  };

  const getMagnitudeBorder = (mag: number) => {
    if (mag >= 7) return 'border-red-600/50 shadow-red-900/30';
    if (mag >= 6) return 'border-red-500/50 shadow-red-800/20';
    if (mag >= 5) return 'border-orange-500/50 shadow-orange-800/20';
    if (mag >= 4) return 'border-yellow-500/50 shadow-yellow-800/20';
    return 'border-lime-500/50 shadow-lime-800/20';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', timeZone: 'Asia/Jakarta' });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Waves className="w-4 h-4 text-blue-400" />
          Data Gempa Terkini
        </h2>
        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
          {earthquakes.length} event
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {earthquakes.map((eq) => (
          <div
            key={eq.id}
            onClick={() => onSelect(eq)}
            className={`px-4 py-3 border-b border-slate-800/50 cursor-pointer transition-all duration-200 hover:bg-slate-800/50 ${
              selectedId === eq.id ? 'bg-blue-900/30 border-l-2 border-l-blue-500' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg ${getMagnitudeColor(eq.magnitude)} ${getMagnitudeBorder(eq.magnitude)}`}>
                {eq.magnitude.toFixed(1)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white truncate">{eq.location}</p>
                  {eq.tsunami_potential && (
                    <span className="flex-shrink-0 flex items-center gap-0.5 text-[10px] bg-red-900/50 text-red-400 px-1.5 py-0.5 rounded border border-red-700/50">
                      <AlertTriangle className="w-3 h-3" />
                      TSUNAMI
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-slate-400 truncate mt-0.5">{eq.region}</p>
                
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Clock className="w-3 h-3" />
                    {formatTime(eq.timestamp)}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <MapPin className="w-3 h-3" />
                    {eq.depth} km
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    eq.status === 'reviewed' ? 'bg-green-900/30 text-green-400' :
                    eq.status === 'automatic' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-slate-700/50 text-slate-400'
                  }`}>
                    {eq.status === 'reviewed' ? '✓ Reviewed' : eq.status === 'automatic' ? '⚡ Auto' : '⏳ Prelim'}
                  </span>
                </div>

                {eq.p_wave_arrival && eq.s_wave_arrival && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <span className="text-[10px] text-blue-400">P: {eq.p_wave_arrival}s</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                      <span className="text-[10px] text-red-400">S: {eq.s_wave_arrival}s</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 text-right">
                <span className="text-[10px] text-slate-500">{formatDate(eq.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
