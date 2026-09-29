import { useState, useEffect } from 'react';
import { Earthquake } from '../types';

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
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 5000);

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

  // Generate seismic wave data
  const generateWavePoints = (type: 'p' | 's', progress: number) => {
    const points: string[] = [];
    const width = 400;
    const height = 80;
    const centerY = height / 2;
    
    for (let x = 0; x <= width; x += 2) {
      const normalizedX = x / width;
      const waveX = normalizedX * 10;
      const amplitude = type === 'p' ? 15 : 25;
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
    <div className="bg-slate-900/80 rounded-xl border border-slate-700/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Visualisasi Gelombang Seismik
        </h3>
        {earthquake && (
          <span className="text-[10px] text-slate-500">
            {earthquake.location} M{earthquake.magnitude.toFixed(1)}
          </span>
        )}
      </div>

      <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800/50">
        <svg viewBox="0 0 400 80" className="w-full h-20">
          {/* Grid lines */}
          {[20, 40, 60].map(y => (
            <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#1e293b" strokeWidth="0.5" />
          ))}
          
          {/* P-wave */}
          <path
            d={generateWavePoints('p', waveProgress)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            opacity="0.8"
          />
          
          {/* S-wave */}
          <path
            d={generateWavePoints('s', waveProgress)}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            opacity="0.8"
          />
        </svg>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-blue-500 rounded" />
              <span className="text-[10px] text-blue-400">P-Wave (6.5 km/s)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-red-500 rounded" />
              <span className="text-[10px] text-red-400">S-Wave (3.7 km/s)</span>
            </div>
          </div>
          
          {earthquake && (
            <div className="text-[10px] text-slate-500">
              Δt = {earthquake.s_wave_arrival && earthquake.p_wave_arrival 
                ? (earthquake.s_wave_arrival - earthquake.p_wave_arrival) 
                : '—'}s
            </div>
          )}
        </div>
      </div>

      {earthquake && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-slate-500">P-Wave</p>
            <p className="text-sm font-bold text-blue-400">{earthquake.p_wave_arrival}s</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-slate-500">S-Wave</p>
            <p className="text-sm font-bold text-red-400">{earthquake.s_wave_arrival}s</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-slate-500">Peringatan</p>
            <p className="text-sm font-bold text-green-400">
              {earthquake.p_wave_arrival ? `${earthquake.p_wave_arrival}s` : '—'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
