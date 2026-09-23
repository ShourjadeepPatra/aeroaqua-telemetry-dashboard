// AeroAqua v2 Math Engine & Derived Parameters

// 1. Adaptive Thermal Baseline (EWMA: alpha = 0.000046 for ~12h memory window)[cite: 1, 2]
export function calculateEWMA(currentTemp, previousBaseline) {
  const alpha = 0.000046;
  return alpha * currentTemp + (1 - alpha) * previousBaseline;
}

// 2. EPA/USGS 3rd-Order DO Saturation Ceiling[cite: 1, 2]
export function getDOSat(T) {
  return 14.652 - 0.41022 * T + 0.0079910 * Math.pow(T, 2) - 0.000077774 * Math.pow(T, 3);
}

// 3. Estimated Bounded DO Recovery during Aeration[cite: 1, 2]
export function getEstimatedDO(T, previousDO, pumpStatus, Ka = 0.15, dt = 2) {
  const DOsat = getDOSat(T);
  if (pumpStatus === 1) {
    // Bounded reaeration mass-balance
    return DOsat - (DOsat - previousDO) * Math.exp(-Ka * (dt / 3600));
  }
  // Natural background consumption decay
  return Math.max(0.5, previousDO - 0.0005 * dt);
}

// 4. Optical Attenuation Index (Kd) for Algal Bloom Risk[cite: 1, 2]
export function getKd(E_surface, E_submerged, dz = 0.3) {
  if (E_submerged <= 0 || E_surface <= 0) return 0;
  return Math.max(0, Math.log(E_surface / E_submerged) / dz);
}

// 5. Algae Bloom Probability Score (%)
export function calculateBloomRisk(Kd, turbidity) {
  let risk = (Kd / 4.0) * 60 + (turbidity / 100.0) * 40;
  return Math.min(100, Math.max(0, Math.round(risk)));
}

// 6. NSF 4-Parameter Fused Water Quality Index (WQI)[cite: 1, 2]
export function calculateWQI(T, baseline, DO_est, pH, turbidity) {
  const DOsat = getDOSat(T);
  const S = Math.min(140, (DO_est / DOsat) * 100);

  let Q_DO = S <= 50 ? 0.185 + 0.015 * S : -66.0 + 2.45 * S - 0.008252 * Math.pow(S, 2);
  Q_DO = Math.min(100, Math.max(0, Q_DO));

  let Q_pH = 100 - Math.abs(pH - 7.0) * 18;
  Q_pH = Math.min(100, Math.max(0, Q_pH));

  let Q_T = 100 - Math.abs(T - baseline) * 15;
  Q_T = Math.min(100, Math.max(0, Q_T));

  let Q_Turb = Math.max(0, 100 - turbidity * 0.6);

  // Re-normalized weights: 0.370 DO + 0.239 pH + 0.217 Temp + 0.174 Turb[cite: 1, 2]
  const WQI = 0.370 * Q_DO + 0.239 * Q_pH + 0.217 * Q_T + 0.174 * Q_Turb;
  
  return {
    wqi: Math.round(WQI),
    subIndices: {
      Q_DO: Math.round(Q_DO),
      Q_pH: Math.round(Q_pH),
      Q_T: Math.round(Q_T),
      Q_Turb: Math.round(Q_Turb)
    }
  };
}