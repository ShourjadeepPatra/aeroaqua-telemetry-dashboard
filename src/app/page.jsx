'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import KpiCards from '@/components/KpiCards';
import DoTempChart from '@/components/Charts/DoTempChart';
import PhTurbidityChart from '@/components/Charts/PhTurbidityChart';
import OpticalKdChart from '@/components/Charts/OpticalKdChart';
import BloomRiskGauge from '@/components/BloomRiskGauge';
import SubIndexBreakdown from '@/components/SubIndexBreakdown';
import IncidentLogger from '@/components/IncidentLogger';
import { subscribeToLiveTelemetry, logIncidentEvent } from '@/lib/firebase';
import {
  calculateEWMA,
  getEstimatedDO,
  getDOSat,
  getKd,
  calculateBloomRisk,
  calculateWQI
} from '@/lib/mathModels';

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState({
    temperature: 26.5,
    ph: 7.2,
    turbidity: 15,
    surfaceLight: 800,
    submergedLight: 350,
    pumpStatus: 0,
    solenoidStatus: 0,
    baseline: 26.5,
    estimatedDO: 6.5,
    doSatPercent: 80,
    kd: 1.2,
    bloomRisk: 25,
    wqi: 85,
    subIndices: { Q_DO: 85, Q_pH: 95, Q_T: 90, Q_Turb: 90 }
  });

  const [isConnected, setIsConnected] = useState(false);
  const [incidentLogs, setIncidentLogs] = useState([]);

  useEffect(() => {
    // 1. Subscribe to Live Firebase Stream
    const unsubscribe = subscribeToLiveTelemetry((rawData) => {
      setIsConnected(true);
      
      const temp = rawData.temperature ?? 26.5;
      const ph = rawData.ph ?? 7.2;
      const turb = rawData.turbidity ?? 15;
      const surfaceE = rawData.surfaceLight ?? 800;
      const subE = rawData.submergedLight ?? 350;
      const pump = rawData.pumpStatus ?? 0;
      const solenoid = rawData.solenoidStatus ?? 0;

      // Science Math Calculations
      const newBaseline = calculateEWMA(temp, telemetry.baseline);
      const newDO = getEstimatedDO(temp, telemetry.estimatedDO, pump);
      const doSat = getDOSat(temp);
      const doSatPct = Math.min(100, (newDO / doSat) * 100);
      const kdVal = getKd(surfaceE, subE);
      const risk = calculateBloomRisk(kdVal, turb);
      const wqiResult = calculateWQI(temp, newBaseline, newDO, ph, turb);

      const computed = {
        temperature: temp,
        ph,
        turbidity: turb,
        surfaceLight: surfaceE,
        submergedLight: subE,
        pumpStatus: pump,
        solenoidStatus: solenoid,
        baseline: newBaseline,
        estimatedDO: newDO,
        doSatPercent: doSatPct,
        kd: kdVal,
        bloomRisk: risk,
        wqi: wqiResult.wqi,
        subIndices: wqiResult.subIndices
      };

      setTelemetry(computed);

      // Log Critical Mortality / PMMSY Hypoxia Events (DO < 3.0 mg/L)[cite: 1, 2]
      if (newDO < 3.0 || wqiResult.wqi < 50) {
        const incident = { ...computed, timestamp: new Date().toISOString() };
        setIncidentLogs((prev) => [incident, ...prev.slice(0, 49)]);
        logIncidentEvent(incident);
      }
    });

    // 2. Mock Generator Fallback if Firebase hardware is offline
    const fallbackTimer = setInterval(() => {
      setTelemetry((prev) => {
        const mockTemp = 25 + Math.sin(Date.now() / 10000) * 3;
        const mockPh = 7.0 + Math.cos(Date.now() / 15000) * 0.4;
        const mockTurb = Math.floor(10 + Math.sin(Date.now() / 8000) * 8);
        const mockBaseline = calculateEWMA(mockTemp, prev.baseline);
        const mockDO = getEstimatedDO(mockTemp, prev.estimatedDO, prev.pumpStatus);
        const doSat = getDOSat(mockTemp);
        const doSatPct = Math.min(100, (mockDO / doSat) * 100);
        const mockKd = getKd(800, 320);
        const risk = calculateBloomRisk(mockKd, mockTurb);
        const wqiResult = calculateWQI(mockTemp, mockBaseline, mockDO, mockPh, mockTurb);

        return {
          ...prev,
          temperature: mockTemp,
          ph: mockPh,
          turbidity: mockTurb,
          baseline: mockBaseline,
          estimatedDO: mockDO,
          doSatPercent: doSatPct,
          kd: mockKd,
          bloomRisk: risk,
          wqi: wqiResult.wqi,
          subIndices: wqiResult.subIndices
        };
      });
      setIsConnected(true);
    }, 2000);

    return () => {
      if (unsubscribe) unsubscribe();
      clearInterval(fallbackTimer);
    };
  }, []);

  return (
    <main className="min-h-screen bg-darkbg text-gray-100 pb-12 flex flex-col gap-6">
      <Header isConnected={isConnected} />

      <div className="px-6 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        {/* Top KPI Cards */}
        <KpiCards telemetry={telemetry} />

        {/* Realtime Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DoTempChart telemetry={telemetry} />
          <PhTurbidityChart telemetry={telemetry} />
          <OpticalKdChart telemetry={telemetry} />
        </div>

        {/* Analytical Indices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BloomRiskGauge riskScore={telemetry.bloomRisk} kd={telemetry.kd} />
          <SubIndexBreakdown subIndices={telemetry.subIndices} />
        </div>

        {/* PMMSY Incident Logger */}
        <IncidentLogger logs={incidentLogs} />
      </div>
    </main>
  );
}