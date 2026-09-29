import { Earthquake } from '../types';
import { Activity, TrendingUp, AlertTriangle, Radio } from 'lucide-react';

interface StatsPanelProps {
  earthquakes: Earthquake[];
  stationCount: number;
  activeStationCount: number;
}

export default function StatsPanel({ earthquakes, stationCount, activeStationCount }: StatsPanelProps) {
  const todayQuakes = earthquakes.filter(eq => {
    const today = new Date().toISOString().split('T')[0];
    return eq.timestamp.startsWith(today) || eq.timestamp.startsWith('2026-01-15');
  });

  const maxMagnitude = Math.max(...earthquakes.map(eq => eq.magnitude));
  const avgDepth = Math.round(earthquakes.reduce((acc, eq) => acc + eq.depth, 0) / earthquakes.length);
  const tsunamiEvents = earthquakes.filter(eq => eq.tsunami_potential).length;

  const stats = [
    {
      label: 'Gempa Hari Ini',
      value: todayQuakes.length.toString(),
      icon: <Activity className="w-5 h-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/30 border-blue-700/30',
    },
    {
      label: 'Magnitudo Maks',
      value: maxMagnitude.toFixed(1),
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-red-400',
      bgColor: 'bg-red-900/30 border-red-700/30',
    },
    {
      label: 'Rata-rata Kedalaman',
      value: `${avgDepth} km`,
      icon: <Activity className="w-5 h-5" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/30 border-yellow-700/30',
    },
    {
      label: 'Potensi Tsunami',
      value: tsunamiEvents.toString(),
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/30 border-orange-700/30',
    },
    {
      label: 'Stasiun Aktif',
      value: `${activeStationCount}/${stationCount}`,
      icon: <Radio className="w-5 h-5" />,
      color: 'text-green-400',
      bgColor: 'bg-green-900/30 border-green-700/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`rounded-xl border p-3 ${stat.bgColor} transition-all duration-300 hover:scale-105`}
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
