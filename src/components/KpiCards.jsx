'use client';

import { Thermometer, Droplets, Activity, Eye, Zap } from 'lucide-react';

export default function KpiCards({ data = {}, telemetry = {} }) {
  // Support both 'data' or 'telemetry' prop names seamlessly
  const stats = data && Object.keys(data).length > 0 ? data : telemetry;

  const temp = typeof stats?.temperature === 'number' ? stats.temperature.toFixed(1) : '--';
  const baseline = typeof stats?.ewmaBaseline === 'number' ? stats.ewmaBaseline.toFixed(1) : '--';
  const doValue = typeof stats?.estimatedDo === 'number' ? stats.estimatedDo.toFixed(2) : '--';
  const ph = typeof stats?.ph === 'number' ? stats.ph.toFixed(1) : '--';
  const turbidity = typeof stats?.turbidity === 'number' ? stats.turbidity : '--';

  const cards = [
    {
      title: 'Water Temp',
      value: `${temp} °C`,
      sub: `Baseline: ${baseline} °C`,
      Icon: Thermometer,
      color: 'text-amber-400',
    },
    {
      title: 'Estimated DO',
      value: `${doValue} mg/L`,
      sub: 'Sat: 80%',
      Icon: Droplets,
      color: 'text-cyan-400',
    },
    {
      title: 'pH Level',
      value: ph,
      sub: stats?.ph >= 6.5 && stats?.ph <= 8.5 ? 'Optimal' : 'Sub-optimal',
      Icon: Activity,
      color: 'text-emerald-400',
    },
    {
      title: 'Turbidity',
      value: `${turbidity} NTU`,
      sub: stats?.turbidity < 25 ? 'Clear Water' : 'Elevated',
      Icon: Eye,
      color: 'text-purple-400',
    },
    {
      title: 'Water Quality Index',
      value: '87 / 100',
      sub: 'Good / Excellent',
      Icon: Zap,
      color: 'text-teal-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const IconComponent = card.Icon;
        return (
          <div
            key={idx}
            className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{card.title}</span>
              <IconComponent className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-100">{card.value}</div>
              <div className="text-xs text-slate-500 mt-1">{card.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}