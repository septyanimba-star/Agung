// ============================================================
// SEISMIC WAVE CALCULATION UTILITIES
// Menghitung jarak, waktu tempuh, dan ETA gelombang seismik
// ============================================================

/**
 * Haversine formula - menghitung jarak antara 2 titik di permukaan bumi
 * @returns jarak dalam kilometer
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius bumi dalam km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Kecepatan gelombang seismik (km/s)
 * Nilai bervariasi berdasarkan kedalaman dan jenis batuan
 */
export const WAVE_SPEEDS = {
  // Gelombang tubuh (body waves)
  P_WAVE_CRUST: 6.5,        // P-wave di kerak bumi (km/s)
  P_WAVE_MANTLE: 8.0,       // P-wave di mantel (km/s)
  S_WAVE_CRUST: 3.7,        // S-wave di kerak bumi (km/s)
  S_WAVE_MANTLE: 4.5,       // S-wave di mantel (km/s)
  
  // Gelombang permukaan (surface waves)
  LOVE_WAVE: 3.9,           // Gelombang Love (km/s)
  RAYLEIGH_WAVE: 3.5,       // Gelombang Rayleigh (km/s)
  
  // Rata-rata untuk perhitungan sederhana
  S_WAVE_AVERAGE: 3.5,      // Rata-rata S-wave (km/s)
  P_WAVE_AVERAGE: 6.0,      // Rata-rata P-wave (km/s)
};

/**
 * Hitung waktu tempuh gelombang P (first arrival)
 * @param distanceKm - jarak horizontal dalam km
 * @param depthKm - kedalaman gempa dalam km
 * @returns waktu dalam detik
 */
export function calculatePWaveArrival(distanceKm: number, depthKm: number): number {
  // Jarak sebenarnya (hypocentral distance)
  const hypoDistance = Math.sqrt(distanceKm * distanceKm + depthKm * depthKm);
  
  // Jika jarak dekat (< 100 km), gunakan kecepatan kerak
  if (distanceKm < 100) {
    return hypoDistance / WAVE_SPEEDS.P_WAVE_CRUST;
  }
  
  // Jika jarak jauh, gunakan rata-rata (campuran kerak + mantel)
  return hypoDistance / WAVE_SPEEDS.P_WAVE_AVERAGE;
}

/**
 * Hitung waktu tempuh gelombang S (destructive wave)
 * @param distanceKm - jarak horizontal dalam km
 * @param depthKm - kedalaman gempa dalam km
 * @returns waktu dalam detik
 */
export function calculateSWaveArrival(distanceKm: number, depthKm: number): number {
  // Jarak sebenarnya (hypocentral distance)
  const hypoDistance = Math.sqrt(distanceKm * distanceKm + depthKm * depthKm);
  
  // Jika jarak dekat (< 100 km), gunakan kecepatan kerak
  if (distanceKm < 100) {
    return hypoDistance / WAVE_SPEEDS.S_WAVE_CRUST;
  }
  
  // Jika jarak jauh, gunakan rata-rata
  return hypoDistance / WAVE_SPEEDS.S_WAVE_AVERAGE;
}

/**
 * Hitung waktu tempuh gelombang permukaan (paling merusak)
 */
export function calculateSurfaceWaveArrival(distanceKm: number): number {
  return distanceKm / WAVE_SPEEDS.RAYLEIGH_WAVE;
}

/**
 * Hitung waktu peringatan (warning time)
 * = waktu S-wave - waktu P-wave
 * Ini adalah waktu yang tersedia untuk mengambil tindakan setelah deteksi
 */
export function calculateWarningTime(distanceKm: number, depthKm: number): number {
  const pArrival = calculatePWaveArrival(distanceKm, depthKm);
  const sArrival = calculateSWaveArrival(distanceKm, depthKm);
  return sArrival - pArrival;
}

/**
 * Estimasi intensitas guncangan (Modified Mercalli Intensity)
 * Berdasarkan magnitudo dan jarak
 */
export function estimateIntensity(magnitude: number, distanceKm: number): number {
  // Formula sederhana berdasarkan attenuasi
  const intensity = magnitude - (1.5 * Math.log10(distanceKm)) + 2.5;
  return Math.max(0, Math.min(12, Math.round(intensity)));
}

/**
 * Deskripsi intensitas MMI
 */
export function getIntensityDescription(intensity: number): string {
  if (intensity <= 1) return 'Tidak terasa';
  if (intensity <= 2) return 'Terasa oleh beberapa orang';
  if (intensity <= 3) return 'Terasa ringan, seperti truk lewat';
  if (intensity <= 4) return 'Terasa seperti benda berat jatuh';
  if (intensity <= 5) return 'Guncangan kuat, benda berjatuhan';
  if (intensity <= 6) return 'Kerusakan ringan pada bangunan';
  if (intensity <= 7) return 'Kerusakan sedang pada bangunan';
  if (intensity <= 8) return 'Kerusakan berat, struktur roboh';
  if (intensity <= 9) return 'Kerusakan sangat berat';
  if (intensity <= 10) return 'Kerusakan total, tanah retak';
  if (intensity <= 11) return 'Hancur total, rel bengkok';
  return 'Katastropik, permukaan hancur';
}

/**
 * Format waktu countdown
 */
export function formatCountdown(seconds: number): { minutes: string; seconds: string; total: string } {
  if (seconds <= 0) {
    return { minutes: '00', seconds: '00', total: '00:00' };
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return {
    minutes: mins.toString().padStart(2, '0'),
    seconds: secs.toString().padStart(2, '0'),
    total: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
  };
}

/**
 * Level bahaya berdasarkan estimasi intensitas
 */
export function getDangerLevel(intensity: number): 'safe' | 'low' | 'moderate' | 'high' | 'extreme' {
  if (intensity <= 2) return 'safe';
  if (intensity <= 4) return 'low';
  if (intensity <= 6) return 'moderate';
  if (intensity <= 8) return 'high';
  return 'extreme';
}
