'use client';

import { calculateSubIndices } from '@/lib/mathModels';

export default function SubIndexBreakdown({ data = {} }) {
  const { qDo, qPh, qTemp, qTurb } = calculateSubIndices(data);

  const subIndices = [
    { label: 'Dissolved Oxygen (Q_DO)', weight: '37.0%', value: qDo },
    { label: 'pH Balance (Q_pH)', weight: '23.9%', value: qPh },
    { label: 'Thermal Stability (Q_T)', weight: '21.7%', value: qTemp },
    { label: 'Turbidity Clarity (Q_Turb)', weight: '17.4%', value: qTurb },
  ];

  return (
    <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-lg">
      <div>
        <h3 className="text-sm font-semibold text-slate-200">NSF Sub-Index Breakdown</h3>
        <p className="text-xs text-slate-400 mt-0.5">Re-normalized Delphi consensus weightings for 4 parameters.</p>
      </div>

      <div className="space-y-4 my-4">
        {subIndices.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">{item.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-mono text-[11px]">Weight: {item.weight}</span>
                <span className="font-bold text-slate-100 font-mono w-10 text-right">{item.value}/100</span>
              </div>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-500"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}