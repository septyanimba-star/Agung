import { useState, useEffect } from 'react';
import { Earthquake } from '../types';
import { Activity, Zap } from 'lucide-react';

interface SeismicVisualizerProps {
  earthquake: Earthquake | null;
}

export default function SeismicVisualizer({ earthquake }: SeismicVisualizerProps) {
  const [waveProgress, setWaveProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (earthquake) {
      setIsAnimating(true);
      setWaveProgress(0);
      const timer = setTimeout(() => setIsAnimating(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [earthquake]);

  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setWaveProgress(prev => {
        if (prev >= 100) {
          setIsAnimating(false);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isAnimating]);

  const generateWavePoints = (type: 'p' | 's', progress: number) => {
    const points: string[] = [];
    const width = 360;
    const height = 60;
    const centerY = height / 2;
    
    for (let x = 0; x <= width; x += 2) {
      const normalizedX = x / width;
      const waveX = normalizedX * 10;
      const amplitude = type === 'p' ? 12 : 20;
      const frequency = type === 'p' ? 3 : 1.5;
      const decay = Math.exp(-normalizedX * 2);
      
      let y = centerY;
      if (normalizedX * 100 <= progress) {
        y = centerY + Math.sin(waveX * frequency) * amplitude * decay;
      }
      
      points.push(`${x},${y}`);
    }
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/80 rounded-xl border border-slate-700/50 p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-blue-400" />
          Gelombang Seismik
        </h3>
        {earthquake && (
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            M{earthquake.magnitude.toFixed(1)}
          </span>
        )}
      </div>

      {/* Wave Visualization */}
      <div className="bg-slate-950/80 rounded-lg p-2 border border-slate-800/50 flex-shrink-0">
        <svg viewBox="0 0 360 60" className="w-full h-16">
          {/* Grid */}
          {[15, 30, 45].map(y => (
            <line key={y} x1="0" y1={y} x2="360" y2={y} stroke="#1e293b" strokeWidth="0.5" />
          ))}
          
          {/* P-wave */}
          <path
            d={generateWavePoints('p', waveProgress)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
            opacity="0.9"
          />
          
          {/* S-wave */}
          <path
            d={generateWavePoints('s', waveProgress)}
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
            opacity="0.9"
          />
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-0.5 bg-blue-500 rounded" />
              <span className="text-[9px] text-blue-400">P (6.5km/s)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-0.5 bg-red-500 rounded" />
              <span className="text-[9px] text-red-400">S (3.7km/s)</span>
            </div>
          </div>
          {earthquake && (
            <span className="text-[9px] text-slate-500">
              Δt={earthquake.s_wave_arrival && earthquake.p_wave_arrival 
                ? (earthquake.s_wave_arrival - earthquake.p_wave_arrival) 
                : '—'}s
            </span>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      {earthquake && (
        <div className="mt-2 grid grid-cols-3 gap-1.5 flex-shrink-0">
          <div className="bg-slate-800/50 rounded-lg p-1.5 text-center">
            <p className="text-[8px] text-slate-500 uppercase">P-Wave</p>
            <p className="text-xs font-bold text-blue-400">{earthquake.p_wave_arrival}s</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-1.5 text-center">
            <p className="text-[8px] text-slate-500 uppercase">S-Wave</p>
            <p className="text-xs font-bold text-red-400">{earthquake.s_wave_arrival}s</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-1.5 text-center">
            <p className="text-[8px] text-slate-500 uppercase">Peringatan</p>
            <p className="text-xs font-bold text-green-400">{earthquake.p_wave_arrival}s</p>
          </div>
        </div>
      )}

      {/* Info */}
      {!earthquake && (
        <div className="mt-2 flex-1 flex items-center justify-center">
          <p className="text-[10px] text-slate-500 text-center">
            Pilih gempa untuk melihat visualisasi gelombang
          </p>
        </div>
      )}

      {/* Earthquake detail */}
      {earthquake && (
        <div className="mt-2 bg-slate-800/30 rounded-lg p-2 border border-slate-700/30 flex-shrink-0">
          <p className="text-[10px] text-slate-400 font-medium mb-1">Detail Gempa</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[9px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Lokasi:</span>
              <span className="text-white font-medium">{earthquake.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Magnitudo:</span>
              <span className="text-white font-medium">M{earthquake.magnitude.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kedalaman:</span>
              <span className="text-white font-medium">{earthquake.depth} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tsunami:</span>
              <span className={`font-medium ${earthquake.tsunami_potential ? 'text-red-400' : 'text-green-400'}`}>
                {earthquake.tsunami_potential ? '⚠ Ya' : '✓ Tidak'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
