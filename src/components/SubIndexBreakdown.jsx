import React from 'react';

export default function SubIndexBreakdown({ subIndices }) {
  const { Q_DO = 0, Q_pH = 0, Q_T = 0, Q_Turb = 0 } = subIndices || {};

  const items = [
    { label: 'Dissolved Oxygen (Q_DO)', value: Q_DO, weight: '37.0%', color: 'bg-accentblue' },
    { label: 'pH Balance (Q_pH)', value: Q_pH, weight: '23.9%', color: 'bg-accentgreen' },
    { label: 'Thermal Stability (Q_T)', value: Q_T, weight: '21.7%', color: 'bg-accentyellow' },
    { label: 'Turbidity Clarity (Q_Turb)', value: Q_Turb, weight: '17.4%', color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-cardbg border border-bordercolor rounded-xl p-5 w-full h-80 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-1">NSF Sub-Index Breakdown</h3>
        <p className="text-xs text-gray-400">Re-normalized Delphi consensus weightings for 4 parameters[cite: 1, 2].</p>
      </div>

      <div className="space-y-4 my-auto">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300 font-medium">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-mono">Weight: {item.weight}</span>
                <span className="text-white font-bold font-mono">{item.value}/100</span>
              </div>
            </div>
            <div className="w-full bg-darkbg rounded-full h-2 overflow-hidden border border-bordercolor">
              <div
                className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                style={{ width: `${Math.min(100, Math.max(0, item.value))}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}