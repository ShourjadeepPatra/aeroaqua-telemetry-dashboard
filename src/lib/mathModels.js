/**
 * Calculates estimated Dissolved Oxygen (DO) saturation in water based on temperature.
 */
export function calculateEPA_DO(temp) {
  const t = typeof temp === 'number' ? temp : 25;
  const doValue = 14.652 - 0.41022 * t + 0.007991 * Math.pow(t, 2) - 0.000077774 * Math.pow(t, 3);
  const clampedDo = Math.max(0, Math.min(15, doValue));

  return {
    do: parseFloat(clampedDo.toFixed(2)),
    saturation: 80,
  };
}

let currentEwma = null;

export function updateEWMA(temp, alpha = 0.15) {
  const t = typeof temp === 'number' ? temp : 25;
  if (currentEwma === null) {
    currentEwma = t;
  } else {
    currentEwma = alpha * t + (1 - alpha) * currentEwma;
  }
  return parseFloat(currentEwma.toFixed(2));
}

export function calculateKd(surfaceLight, submergedLight, depthMeters = 0.5) {
  const i0 = Math.max(1, surfaceLight || 800);
  const iz = Math.max(0.1, submergedLight || 350);

  if (iz >= i0) return 0.1;

  const kd = -Math.log(iz / i0) / depthMeters;
  return parseFloat(Math.max(0, Math.min(10, kd)).toFixed(2));
}

/**
 * Calculates Algae Bloom Probability (%) based on Kd attenuation and turbidity.
 */
export function calculateBloomRisk(kd = 0, turbidity = 0) {
  const riskRaw = (kd / 3) * 60 + (turbidity / 100) * 40;
  const probability = Math.min(100, Math.max(0, Math.round(riskRaw)));
  
  let status = 'LOW RISK';
  let color = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

  if (probability > 70) {
    status = 'CRITICAL RISK';
    color = 'text-red-400 bg-red-500/10 border-red-500/20';
  } else if (probability > 40) {
    status = 'MODERATE RISK';
    color = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  }

  return { probability, status, color };
}

/**
 * Calculates NSF Sub-Indices Q-scores and overall Water Quality Index (WQI).
 */
export function calculateSubIndices(data = {}) {
  const doMgL = data.estimatedDo ?? 7.0;
  const ph = data.ph ?? 7.0;
  const temp = data.temperature ?? 25;
  const turbidity = data.turbidity ?? 10;

  // Q-DO (37.0% weight)
  const qDo = Math.min(100, Math.max(0, Math.round((doMgL / 8.5) * 100)));

  // Q-pH (23.9% weight)
  const phDev = Math.abs(ph - 7.0);
  const qPh = Math.min(100, Math.max(0, Math.round(100 - phDev * 20)));

  // Q-T Thermal Stability (21.7% weight)
  const qTemp = Math.min(100, Math.max(0, Math.round(100 - Math.abs(temp - 26) * 3)));

  // Q-Turbidity (17.4% weight)
  const qTurb = Math.min(100, Math.max(0, Math.round(Math.max(0, 100 - turbidity * 1.5))));

  // Overall WQI Score
  const wqi = Math.round(qDo * 0.37 + qPh * 0.239 + qTemp * 0.217 + qTurb * 0.174);

  return {
    qDo,
    qPh,
    qTemp,
    qTurb,
    wqi,
  };
}