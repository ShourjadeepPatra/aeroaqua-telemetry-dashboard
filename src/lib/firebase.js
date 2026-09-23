import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { calculateEPA_DO, updateEWMA, calculateKd } from './mathModels';

const firebaseConfig = {
  databaseURL: 'https://aeroaqua-v2-default-rtdb.firebaseio.com',
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getDatabase(app);

/**
 * Subscribes to live telemetry stream and maintains rolling chart history.
 * @param {Function} setLatestData - State setter for real-time KPI cards.
 * @param {Function} setHistory - State setter for chart history arrays.
 */
export function subscribeToTelemetry(setLatestData, setHistory) {
  const telemetryRef = ref(db, 'telemetry/live');

  return onValue(telemetryRef, (snapshot) => {
    const rawData = snapshot.val();
    if (!rawData) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Run math models on incoming telemetry payload
    const doSat = calculateEPA_DO(rawData.temperature || 25);
    const ewmaTemp = updateEWMA(rawData.temperature || 25);
    const kd = calculateKd(rawData.surfaceLight || 800, rawData.submergedLight || 350);

    const newPoint = {
      timestamp,
      temperature: rawData.temperature ?? 0,
      ph: rawData.ph ?? 7,
      turbidity: rawData.turbidity ?? 0,
      surfaceLight: rawData.surfaceLight ?? 0,
      submergedLight: rawData.submergedLight ?? 0,
      pumpStatus: rawData.pumpStatus ?? 0,
      solenoidStatus: rawData.solenoidStatus ?? 0,
      estimatedDo: doSat.do,
      ewmaBaseline: ewmaTemp,
      kd: kd,
    };

    // Update real-time KPI state
    setLatestData(newPoint);

    // Append to rolling history array (max 30 points)
    setHistory((prev) => {
      const updated = [...prev, newPoint];
      return updated.length > 30 ? updated.slice(updated.length - 30) : updated;
    });
  });
}