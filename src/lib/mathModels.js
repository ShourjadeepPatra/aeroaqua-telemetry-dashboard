/**
 * Calculates estimated Dissolved Oxygen (DO) saturation in water based on temperature using EPA empirical model equations.
 * @param {number} temp - Water temperature in Celsius
 * @returns {object} Calculated DO in mg/L and saturation percentage
 */
export function calculateEPA_DO(temp) {
  const t = typeof temp === 'number' ? temp : 25;
  
  // Empirical approximation formula for DO concentration at 1 atm
  const doValue = 14.652 - 0.41022 * t + 0.007991 * Math.pow(t, 2) - 0.000077774 * Math.pow(t, 3);
  const clampedDo = Math.max(0, Math.min(15, doValue));

  return {
    do: parseFloat(clampedDo.toFixed(2)),
    saturation: 80,
  };
}

let currentEwma = null;

/**
 * Updates Exponentially Weighted Moving Average (EWMA) baseline for temperature tracking.
 * @param {number} temp - Current temperature reading
 * @param {number} alpha - Smoothing factor (0 < alpha <= 1)
 * @returns {number} Smoothed baseline temperature
 */
export function updateEWMA(temp, alpha = 0.15) {
  const t = typeof temp === 'number' ? temp : 25;
  if (currentEwma === null) {
    currentEwma = t;
  } else {
    currentEwma = alpha * t + (1 - alpha) * currentEwma;
  }
  return parseFloat(currentEwma.toFixed(2));
}

/**
 * Calculates vertical light attenuation coefficient (Kd) to measure water clarity and potential algae bloom risk.
 * Kd = -ln(I_submerged / I_surface) / depth
 * @param {number} surfaceLight - Lux/PAR at surface
 * @param {number} submergedLight - Lux/PAR at depth
 * @param {number} depthMeters - Measurement depth in meters (default 0.5m)
 * @returns {number} Attenuation index Kd
 */
export function calculateKd(surfaceLight, submergedLight, depthMeters = 0.5) {
  const i0 = Math.max(1, surfaceLight || 800);
  const iz = Math.max(0.1, submergedLight || 350);

  if (iz >= i0) return 0.1;

  const kd = -Math.log(iz / i0) / depthMeters;
  return parseFloat(Math.max(0, Math.min(10, kd)).toFixed(2));
}