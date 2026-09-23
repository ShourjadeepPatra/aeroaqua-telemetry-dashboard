'use client';

import { useState, useEffect } from 'react';
import { Download, AlertCircle } from 'lucide-react';
import { calculateSubIndices } from '@/lib/mathModels';

export default function IncidentLogger({ data = {} }) {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    if (!data.timestamp) return;

    const { wqi } = calculateSubIndices(data);
    const isHypoxia = (data.estimatedDo ?? 7.0) < 5.0;
    const isCriticalPh = (data.ph ?? 7.0) < 6.0 || (data.ph ?? 7.0) > 8.8;
    const isHighTurbidity = (data.turbidity ?? 0) > 30;

    if (isHypoxia || isCriticalPh || isHighTurbidity) {
      const newIncident = {
        timestamp: data.timestamp,
        temp: (data.temperature ?? 0).toFixed(1),
        do: (data.estimatedDo ?? 0).toFixed(2),
        ph: (data.ph ?? 0).toFixed(1),
        turbidity: data.turbidity ?? 0,
        wqi,
        pump: data.pumpStatus ? 'ON' : 'OFF',
      };

      setIncidents((prev) => {
        if (prev.length > 0 && prev[0].timestamp === newIncident.timestamp) return prev;
        return [newIncident, ...prev].slice(0, 5);
      });
    }
  }, [data]);

  const exportCSV = () => {
    if (incidents.length === 0) return;
    const headers = 'Timestamp,Temp(C),DO(mg/L),pH,Turbidity(NTU),WQI,Pump\n';
    const rows = incidents
      .map((i) => `${i.timestamp},${i.temp},${i.do},${i.ph},${i.turbidity},${i.wqi},${i.pump}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AeroAqua_PMMSY_Log_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" /> Proof-of-Loss Incident Log (PMMSY)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Automated timestamped logging for hypoxia & severe quality events.</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={incidents.length === 0}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-400 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <Download className="w-3.5 h-3.5" /> Export PMMSY CSV
        </button>
      </div>

      <div className="overflow-x-auto my-2">
        {incidents.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
            No critical mortality incidents recorded. Water parameters nominal.
          </div>
        ) : (
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2">Timestamp</th>
                <th className="pb-2">Temp (°C)</th>
                <th className="pb-2">DO (mg/L)</th>
                <th className="pb-2">pH</th>
                <th className="pb-2">Turbidity</th>
                <th className="pb-2">WQI</th>
                <th className="pb-2">Pump</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {incidents.map((row, idx) => (
                <tr key={idx} className="text-slate-300 hover:bg-slate-800/30">
                  <td className="py-2 text-cyan-400">{row.timestamp}</td>
                  <td className="py-2">{row.temp}</td>
                  <td className="py-2 text-amber-400">{row.do}</td>
                  <td className="py-2">{row.ph}</td>
                  <td className="py-2">{row.turbidity}</td>
                  <td className="py-2 text-emerald-400">{row.wqi}</td>
                  <td className="py-2">{row.pump}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}