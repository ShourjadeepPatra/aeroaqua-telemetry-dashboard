import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function BloomRiskGauge({ riskScore = 0, kd = 0 }) {
  const getRiskLevel = (score) => {
    if (score >= 70) return { label: 'HIGH RISK', color: 'text-accentred', bg: 'bg-accentred/10', border: 'border-accentred/30' };
    if (score >= 40) return { label: 'MODERATE RISK', color: 'text-accentyellow', bg: 'bg-accentyellow/10', border: 'border-accentyellow/30' };
    return { label: 'LOW RISK', color: 'text-accentgreen', bg: 'bg-accentgreen/10', border: 'border-accentgreen/30' };
  };

  const risk = getRiskLevel(riskScore);

  return (
    <div className="bg-cardbg border border-bordercolor rounded-xl p-5 w-full flex flex-col justify-between h-80">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-300">Algae Bloom Probability</h3>
          {riskScore >= 70 ? (
            <AlertTriangle className="w-5 h-5 text-accentred animate-bounce" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-accentgreen" />
          )}
        </div>
        <p className="text-xs text-gray-400">
          Derived from optical attenuation (<code className="text-accentblue font-mono">Kd</code>) and turbidity metrics[cite: 1, 2].
        </p>
      </div>

      <div className="flex flex-col items-center my-4">
        <div className="text-5xl font-black text-white tracking-tight">{riskScore}%</div>
        <div className={`mt-3 px-3 py-1 text-xs font-bold rounded-full border ${risk.bg} ${risk.color} ${risk.border}`}>
          {risk.label}
        </div>
      </div>

      <div className="bg-darkbg p-3 rounded-lg border border-bordercolor flex justify-between items-center text-xs">
        <span className="text-gray-400">Attenuation Coefficient (Kd):</span>
        <span className="font-mono text-accentblue font-bold">{kd.toFixed(2)} m⁻¹</span>
      </div>
    </div>
  );
}