import React from 'react';
import { Thermometer, Droplet, Activity, Wind, Zap } from 'lucide-react';

export default function KpiCards({ telemetry }) {
  const cards = [
    {
      title: 'Water Temp',
      value: `${telemetry.temperature?.toFixed(1) ?? '--'} °C`,
      sub: `Baseline: ${telemetry.baseline?.toFixed(1) ?? '--'} °C`,
      icon: Thermometer,
      color: 'text-accentyellow',
    },
    {
      title: 'Estimated DO',
      value: `${telemetry.estimatedDO?.toFixed(2) ?? '--'} mg/L`,
      sub: `Sat: ${telemetry.doSatPercent?.toFixed(0) ?? '--'}%`,
      icon: Wind,
      color: 'text-accentblue',
    },
    {
      title: 'pH Level',
      value: `${telemetry.ph?.toFixed(1) ?? '--'}`,
      sub: telemetry.ph >= 6.5 && telemetry.ph <= 8.5 ? 'Optimal' : 'Sub-optimal',
      icon: Droplet,
      color: 'text-accentgreen',
    },
    {
      title: 'Turbidity',
      value: `${telemetry.turbidity ?? '--'} NTU`,
      sub: telemetry.turbidity < 30 ? 'Clear Water' : 'High Suspended Solids',
      icon: Activity,
      color: 'text-purple-400',
    },
    {
      title: 'Water Quality Index',
      value: `${telemetry.wqi ?? '--'} / 100`,
      sub: telemetry.wqi >= 70 ? 'Good / Excellent' : 'Action Required',
      icon: Zap,
      color: telemetry.wqi >= 70 ? 'text-accentgreen' : 'text-accentred',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-cardbg border border-bordercolor rounded-xl p-4 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-400">{card.title}</span>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold text-white my-1">{card.value}</div>
            <div className="text-[11px] text-gray-400">{card.sub}</div>
          </div>
        );
      })}
    </div>
  );
}