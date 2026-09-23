import React from 'react';
import { Download, FileText } from 'lucide-react';

export default function IncidentLogger({ logs = [] }) {
  const downloadCSV = () => {
    if (!logs.length) return;
    const headers = ['Timestamp,Temperature(C),DO(mg/L),pH,Turbidity(NTU),WQI,PumpStatus\n'];
    const rows = logs.map(l => `${l.timestamp},${l.temperature},${l.estimatedDO},${l.ph},${l.turbidity},${l.wqi},${l.pumpStatus}`);
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proof_of_loss_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="bg-cardbg border border-bordercolor rounded-xl p-5 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-accentyellow" />
            Proof-of-Loss Incident Log (PMMSY Compliance)[cite: 1, 2]
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Automated timestamped logging for hypoxia & severe quality events[cite: 1, 2].</p>
        </div>
        <button
          onClick={downloadCSV}
          disabled={!logs.length}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accentblue/10 border border-accentblue/30 text-accentblue hover:bg-accentblue/20 transition-all text-xs font-semibold disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export PMMSY CSV[cite: 1, 2]
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-darkbg text-gray-400 border-b border-bordercolor">
            <tr>
              <th className="p-2.5">Timestamp</th>
              <th className="p-2.5">Temp (°C)</th>
              <th className="p-2.5">DO (mg/L)</th>
              <th className="p-2.5">pH</th>
              <th className="p-2.5">Turbidity</th>
              <th className="p-2.5">WQI</th>
              <th className="p-2.5">Pump</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bordercolor font-mono">
            {logs.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500 font-sans">
                  No critical mortality incidents recorded. Water parameters nominal.
                </td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <tr key={index} className="hover:bg-darkbg/50">
                  <td className="p-2.5">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="p-2.5">{log.temperature?.toFixed(1)}</td>
                  <td className="p-2.5 text-accentblue font-bold">{log.estimatedDO?.toFixed(2)}</td>
                  <td className="p-2.5">{log.ph?.toFixed(1)}</td>
                  <td className="p-2.5">{log.turbidity} NTU</td>
                  <td className="p-2.5">{log.wqi}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.pumpStatus === 1 ? 'bg-accentgreen/20 text-accentgreen' : 'bg-gray-800 text-gray-400'}`}>
                      {log.pumpStatus === 1 ? 'ON' : 'OFF'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}