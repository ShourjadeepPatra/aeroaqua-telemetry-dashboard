'use client';

import { useState, useEffect, useCallback } from 'react';
import { subscribeToLiveTelemetry } from '@/lib/firebase';
import { calculateEPA_DO, updateEWMA, calculateKd } from '@/lib/mathModels';

import Header from '@/components/Header';
import KpiCards from '@/components/KpiCards';
import DoTempChart from '@/components/Charts/DoTempChart';
import PhTurbidityChart from '@/components/Charts/PhTurbidityChart';
import OpticalKdChart from '@/components/Charts/OpticalKdChart';
import BloomRiskGauge from '@/components/BloomRiskGauge';
import IncidentLogger from '@/components/IncidentLogger';
import SubIndexBreakdown from '@/components/SubIndexBreakdown';

import { Maximize2, Minimize2, X } from 'lucide-react';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [activeFullscreen, setActiveFullscreen] = useState(null);

  const [latestData, setLatestData] = useState({
    temperature: 30.9,
    ph: 6.8,
    turbidity: 9,
    surfaceLight: 800,
    submergedLight: 350,
    pumpStatus: 0,
    solenoidStatus: 0,
    estimatedDo: 7.32,
    ewmaBaseline: 31.0,
    kd: 1.2,
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToLiveTelemetry((rawData) => {
      setIsConnected(true);

      const timestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const temp = rawData.temperature ?? 30.9;
      const ph = rawData.ph ?? 6.8;
      const turbidity = rawData.turbidity ?? 9;
      const surface = rawData.surfaceLight ?? 800;
      const submerged = rawData.submergedLight ?? 350;

      const doSat = calculateEPA_DO(temp);
      const ewmaTemp = updateEWMA(temp);
      const kd = calculateKd(surface, submerged);

      const newPoint = {
        timestamp,
        temperature: temp,
        ph: ph,
        turbidity: turbidity,
        surfaceLight: surface,
        submergedLight: submerged,
        pumpStatus: rawData.pumpStatus ?? 0,
        solenoidStatus: rawData.solenoidStatus ?? 0,
        estimatedDo: doSat.do,
        ewmaBaseline: ewmaTemp,
        kd: kd,
      };

      setLatestData(newPoint);

      setHistory((prev) => {
        const updated = [...prev, newPoint];
        return updated.length > 30 ? updated.slice(updated.length - 30) : updated;
      });
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Keyboard shortcut listener: ESC exits full screen
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setActiveFullscreen(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const chartCards = [
    {
      id: 'do-temp',
      title: 'Live Dissolved Oxygen vs. Temperature Dynamics',
      Component: DoTempChart,
    },
    {
      id: 'ph-turbidity',
      title: 'Water Chemistry (pH & Turbidity)',
      Component: PhTurbidityChart,
    },
    {
      id: 'optical-kd',
      title: 'Optical Attenuation (Algae Bloom Indicator Kd)',
      Component: OpticalKdChart,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 relative selection:bg-cyan-500/30">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />

      {/* Main Header */}
      <Header isConnected={isConnected} />

      {/* Top KPI Stream Cards */}
      <KpiCards data={latestData} />

      {/* Interactive Flowing Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {chartCards.map((chart) => {
          const ChartComp = chart.Component;
          return (
            <div
              key={chart.id}
              onClick={() => setActiveFullscreen(chart.id)}
              className="group relative p-4 bg-slate-900/70 hover:bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 cursor-pointer overflow-hidden backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors">
                  {chart.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFullscreen(chart.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Expand to Fullscreen (Esc to close)"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <div className="w-full h-56 transition-transform duration-300">
                <ChartComp history={history} />
              </div>

              <div className="absolute bottom-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-500 font-mono">
                Click to expand
              </div>
            </div>
          );
        })}
      </div>

      {/* Restored UI Components: Risk Analytics & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BloomRiskGauge data={latestData} />
        <SubIndexBreakdown data={latestData} />
        <IncidentLogger data={latestData} />
      </div>

      {/* Modal Fullscreen Overlay */}
      {activeFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl p-6 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                {chartCards.find((c) => c.id === activeFullscreen)?.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-Time High Frequency Telemetry • Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-cyan-400">Esc</kbd> to exit
              </p>
            </div>
            <button
              onClick={() => setActiveFullscreen(null)}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full flex-1 my-6 p-4 bg-slate-900/50 rounded-2xl border border-slate-800/80">
            {activeFullscreen === 'do-temp' && <DoTempChart history={history} isFullscreen />}
            {activeFullscreen === 'ph-turbidity' && <PhTurbidityChart history={history} isFullscreen />}
            {activeFullscreen === 'optical-kd' && <OpticalKdChart history={history} isFullscreen />}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveFullscreen(null)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
            >
              <Minimize2 className="w-4 h-4" /> Close Fullscreen
            </button>
          </div>
        </div>
      )}
    </main>
  );
}