import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  databaseURL: 'https://aeroaqua-v2-default-rtdb.firebaseio.com',
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getDatabase(app);

/**
 * Subscribes directly to live telemetry stream from Firebase RTDB.
 * Passes raw payload to the caller for history appending and models.
 */
export function subscribeToLiveTelemetry(callback) {
  const telemetryRef = ref(db, 'telemetry/live');

  return onValue(
    telemetryRef,
    (snapshot) => {
      const data = snapshot.val();
      if (data && callback) {
        callback(data);
      }
    },
    (error) => {
      console.error('Firebase subscription error:', error);
    }
  );
}