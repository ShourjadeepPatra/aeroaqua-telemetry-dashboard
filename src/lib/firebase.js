import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDYU1A0on_2gl5abdAzIya2I6XBADfY5oQ",
  authDomain: "aeroaqua-v2.firebaseapp.com",
  databaseURL: "https://aeroaqua-v2-default-rtdb.firebaseio.com",
  projectId: "aeroaqua-v2",
  storageBucket: "aeroaqua-v2.firebasestorage.app",
  messagingSenderId: "66733002593",
  appId: "1:66733002593:web:297190fe39ad14a6657f20",
  measurementId: "G-5MJ9D904WM"
};

// Prevent duplicate initialization during Next.js hot reloading
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const database = getDatabase(app);

// Real-time listener for live ESP8266 sensor telemetry
export function subscribeToLiveTelemetry(callback) {
  const liveRef = ref(database, 'telemetry/live');
  return onValue(liveRef, (snapshot) => {
    const data = snapshot.val();
    if (data) callback(data);
  });
}

// Push incident records for PMMSY Proof-of-Loss compliance[cite: 1, 2]
export async function logIncidentEvent(incidentData) {
  const logRef = ref(database, 'telemetry/incidents');
  const newLogRef = push(logRef);
  await set(newLogRef, {
    ...incidentData,
    timestamp: new Date().toISOString()
  });
}