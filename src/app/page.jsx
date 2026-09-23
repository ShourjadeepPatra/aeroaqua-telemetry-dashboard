'use client';

import { useState, useEffect } from 'react';
import { subscribeToLiveTelemetry } from '@/lib/firebase';
import { calculateEPA_DO, updateEWMA, calculateKd } from '@/lib/mathModels';

import Header from '@/components/Header';
import KpiCards from '@/components/KpiCards';
import DoTempChart from '@/components/Charts/DoTempChart';
import PhTurbidityChart from '@/components/Charts/PhTurbidityChart';
import OpticalKdChart from '@/components/Charts/OpticalKdChart';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [latestData, setLatestData] = useState({
    temperature: 26.5,
    ph: 7.2,
    turbidity: 15,
    surfaceLight: 800,
    submergedLight: 350,
    pumpStatus: 0,
    solenoidStatus: 0,
    estimatedDo: 6.5,
    ewmaBaseline: 26.5,
    kd: 1.2,
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Subscribe to Firebase real-time stream
    const unsubscribe = subscribeToLiveTelemetry((rawData) => {
      setIsConnected(true);

      const timestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const temp = rawData.temperature ?? 26.5;
      const ph = rawData.ph ?? 7.2;
      const turbidity = rawData.turbidity ?? 15;
      const surface = rawData.surfaceLight ?? 800;
      const submerged = rawData.submergedLight ?? 350;

      // Run environmental algorithms
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

      // Set current KPI values
      setLatestData(newPoint);

      // Append to 30-point rolling window array for continuous live charts
      setHistory((prev) => {
        const updated = [...prev, newPoint];
        return updated.length > 30 ? updated.slice(updated.length - 30) : updated;
      });
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      <Header isConnected={isConnected} />
      
      <KpiCards data={latestData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DoTempChart history={history} />
        <PhTurbidityChart history={history} />
        <OpticalKdChart history={history} />
      </div>
    </main>
  );
}