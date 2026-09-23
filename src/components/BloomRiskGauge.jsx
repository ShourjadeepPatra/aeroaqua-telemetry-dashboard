'use client';

import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { calculateBloomRisk } from '@/lib/mathModels';

export default function BloomRiskGauge({ data = {} }) {
  const { probability, status, color } = calculateBloomRisk(data.kd, data.turbidity);

  return (
    <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Algae Bloom Probability</h3>
          <p className="text-xs text-slate-400 mt-0.5">Derived from optical attenuation (Kd) and turbidity metrics.</p>
        </div>
        {probability > 50 ? (
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        ) : (
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        )}
      </div>

      <div className="my-6 text-center">
        <div className="text-5xl font-extrabold tracking-tight text-slate-100 transition-all duration-500">
          {probability}%
        </div>
        <div className="mt-3 inline-block">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${color} transition-all duration-300`}>
            {status}
          </span>
        </div>
      </div>

      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400">Attenuation Coefficient (Kd):</span>
        <span className="font-mono text-cyan-400 font-medium">{(data.kd ?? 0).toFixed(2)} m⁻¹</span>
      </div>
    </div>
  );
}