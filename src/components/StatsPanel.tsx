import { Earthquake } from '../types';
import { Activity, TrendingUp, AlertTriangle, Radio, Waves, Timer } from 'lucide-react';

interface StatsPanelProps {
  earthquakes: Earthquake[];
  stationCount: number;
  activeStationCount: number;
}

export default function StatsPanel({ earthquakes, stationCount, activeStationCount }: StatsPanelProps) {
  // Count earthquakes in last 24 hours
  const recentQuakes = earthquakes.filter(eq => {
    const diff = Date.now() - new Date(eq.timestamp).getTime();
    return diff < 86400000; // 24 hours
  });

  const maxMagnitude = earthquakes.length > 0 ? Math.max(...earthquakes.map(eq => eq.magnitude)) : 0;
  const avgDepth = earthquakes.length > 0 ? Math.round(earthquakes.reduce((acc, eq) => acc + eq.depth, 0) / earthquakes.length) : 0;
  const tsunamiEvents = earthquakes.filter(eq => eq.tsunami_potential).length;
  
  // Calculate magnitude distribution
  const majorQuakes = earthquakes.filter(eq => eq.magnitude >= 6).length;

  const stats = [
    {
      label: 'Gempa 24 Jam',
      value: recentQuakes.length.toString(),
      icon: <Activity className="w-5 h-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/30 border-blue-700/30',
    },
    {
      label: 'Magnitudo Maks',
      value: maxMagnitude.toFixed(1),
      icon: <TrendingUp className="w-5 h-5" />,
      color: maxMagnitude >= 7 ? 'text-red-400' : maxMagnitude >= 6 ? 'text-orange-400' : 'text-yellow-400',
      bgColor: maxMagnitude >= 7 ? 'bg-red-900/30 border-red-700/30' : maxMagnitude >= 6 ? 'bg-orange-900/30 border-orange-700/30' : 'bg-yellow-900/30 border-yellow-700/30',
    },
    {
      label: 'Rata-rata Kedalaman',
      value: `${avgDepth} km`,
      icon: <Timer className="w-5 h-5" />,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-900/30 border-cyan-700/30',
    },
    {
      label: 'Potensi Tsunami',
      value: tsunamiEvents.toString(),
      icon: <AlertTriangle className="w-5 h-5" />,
      color: tsunamiEvents > 0 ? 'text-red-400' : 'text-green-400',
      bgColor: tsunamiEvents > 0 ? 'bg-red-900/30 border-red-700/30' : 'bg-green-900/30 border-green-700/30',
    },
    {
      label: 'Stasiun Aktif',
      value: `${activeStationCount}/${stationCount}`,
      icon: <Radio className="w-5 h-5" />,
      color: activeStationCount === stationCount ? 'text-green-400' : 'text-yellow-400',
      bgColor: activeStationCount === stationCount ? 'bg-green-900/30 border-green-700/30' : 'bg-yellow-900/30 border-yellow-700/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`rounded-xl border p-3 ${stat.bgColor} transition-all duration-300 hover:scale-105 hover:shadow-lg`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={stat.color}>{stat.icon}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
              {stat.label}
            </span>
          </div>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
