import { Earthquake, WarningAlert, StationData } from '../types';

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();
const minutesAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString();

export const recentEarthquakes: Earthquake[] = [
  {
    id: 'EQ-2026-001', magnitude: 5.8, depth: 35, latitude: -8.5147, longitude: 115.5321,
    location: 'Bali', region: 'Laut Bali, 52 km Timur Laut Karangasem',
    timestamp: minutesAgo(12), status: 'reviewed', tsunami_potential: false,
    felt_intensity: 4, p_wave_arrival: 12, s_wave_arrival: 28,
  },
  {
    id: 'EQ-2026-002', magnitude: 6.4, depth: 18, latitude: -7.2341, longitude: 107.8923,
    location: 'Jawa Barat', region: '23 km Tenggara Garut, Jawa Barat',
    timestamp: minutesAgo(45), status: 'reviewed', tsunami_potential: false,
    felt_intensity: 5, p_wave_arrival: 8, s_wave_arrival: 19,
  },
  {
    id: 'EQ-2026-003', magnitude: 7.1, depth: 12, latitude: -9.1234, longitude: 119.4567,
    location: 'NTT', region: 'Laut Sawu, 85 km Barat Daya Sumba, NTT',
    timestamp: hoursAgo(1), status: 'reviewed', tsunami_potential: true,
    felt_intensity: 6, p_wave_arrival: 6, s_wave_arrival: 14,
  },
  {
    id: 'EQ-2026-004', magnitude: 4.2, depth: 55, latitude: 1.2345, longitude: 124.5678,
    location: 'Sulawesi Utara', region: '45 km Barat Laut Manado',
    timestamp: hoursAgo(2), status: 'automatic', tsunami_potential: false,
    felt_intensity: 2, p_wave_arrival: 18, s_wave_arrival: 42,
  },
  {
    id: 'EQ-2026-005', magnitude: 5.1, depth: 28, latitude: -2.5678, longitude: 140.1234,
    location: 'Papua', region: '67 km Tenggara Jayapura',
    timestamp: hoursAgo(3), status: 'reviewed', tsunami_potential: false,
    felt_intensity: 3, p_wave_arrival: 15, s_wave_arrival: 35,
  },
  {
    id: 'EQ-2026-006', magnitude: 6.8, depth: 10, latitude: -6.7890, longitude: 110.2345,
    location: 'Jawa Tengah', region: 'Laut Jawa, 78 km Utara Semarang',
    timestamp: hoursAgo(4), status: 'reviewed', tsunami_potential: false,
    felt_intensity: 5, p_wave_arrival: 9, s_wave_arrival: 21,
  },
  {
    id: 'EQ-2026-007', magnitude: 4.8, depth: 42, latitude: -1.4567, longitude: 121.3456,
    location: 'Sulawesi Tengah', region: '34 km Tenggara Palu',
    timestamp: hoursAgo(5), status: 'automatic', tsunami_potential: false,
    felt_intensity: 3, p_wave_arrival: 14, s_wave_arrival: 33,
  },
  {
    id: 'EQ-2026-008', magnitude: 5.5, depth: 22, latitude: -3.4567, longitude: 102.3456,
    location: 'Bengkulu', region: '56 km Barat Daya Bengkulu',
    timestamp: hoursAgo(6), status: 'reviewed', tsunami_potential: false,
    felt_intensity: 4, p_wave_arrival: 11, s_wave_arrival: 26,
  },
  {
    id: 'EQ-2026-009', magnitude: 3.9, depth: 68, latitude: -6.1234, longitude: 106.8901,
    location: 'DKI Jakarta', region: '12 km Tenggara Jakarta',
    timestamp: hoursAgo(7), status: 'reviewed', tsunami_potential: false,
    felt_intensity: 2, p_wave_arrival: 22, s_wave_arrival: 52,
  },
  {
    id: 'EQ-2026-010', magnitude: 6.2, depth: 15, latitude: -8.9012, longitude: 117.1234,
    location: 'NTB', region: 'Laut Flores, 95 km Tenggara Lombok',
    timestamp: hoursAgo(8), status: 'reviewed', tsunami_potential: true,
    felt_intensity: 5, p_wave_arrival: 7, s_wave_arrival: 16,
  },
  {
    id: 'EQ-2026-011', magnitude: 4.6, depth: 38, latitude: -5.4523, longitude: 105.2341,
    location: 'Lampung', region: '42 km Barat Daya Bandar Lampung',
    timestamp: hoursAgo(9), status: 'reviewed', tsunami_potential: false,
    felt_intensity: 3, p_wave_arrival: 13, s_wave_arrival: 31,
  },
  {
    id: 'EQ-2026-012', magnitude: 5.3, depth: 25, latitude: -7.5612, longitude: 110.4523,
    location: 'DIY Yogyakarta', region: '28 km Selatan Yogyakarta',
    timestamp: hoursAgo(10), status: 'reviewed', tsunami_potential: false,
    felt_intensity: 4, p_wave_arrival: 10, s_wave_arrival: 24,
  },
  {
    id: 'EQ-2026-013', magnitude: 3.5, depth: 72, latitude: -6.8934, longitude: 107.6123,
    location: 'Jawa Barat', region: '15 km Timur Laut Bandung',
    timestamp: hoursAgo(11), status: 'reviewed', tsunami_potential: false,
    felt_intensity: 2, p_wave_arrival: 25, s_wave_arrival: 58,
  },
  {
    id: 'EQ-2026-014', magnitude: 5.9, depth: 16, latitude: -1.8234, longitude: 128.1567,
    location: 'Maluku', region: 'Laut Seram, 65 km Barat Laut Ambon',
    timestamp: hoursAgo(12), status: 'reviewed', tsunami_potential: false,
    felt_intensity: 4, p_wave_arrival: 11, s_wave_arrival: 25,
  },
  {
    id: 'EQ-2026-015', magnitude: 4.1, depth: 48, latitude: 0.5623, longitude: 123.0456,
    location: 'Sulawesi Utara', region: '38 km Tenggara Gorontalo',
    timestamp: hoursAgo(13), status: 'automatic', tsunami_potential: false,
    felt_intensity: 2, p_wave_arrival: 16, s_wave_arrival: 38,
  },
  {
    id: 'EQ-2026-016', magnitude: 6.0, depth: 20, latitude: -8.2345, longitude: 114.5678,
    location: 'Jawa Timur', region: '85 km Selatan Banyuwangi',
    timestamp: hoursAgo(14), status: 'reviewed', tsunami_potential: false,
    felt_intensity: 4, p_wave_arrival: 9, s_wave_arrival: 22,
  },
  {
    id: 'EQ-2026-017', magnitude: 3.2, depth: 85, latitude: -7.1234, longitude: 112.5678,
    location: 'Jawa Timur', region: '22 km Barat Laut Surabaya',
    timestamp: hoursAgo(15), status: 'reviewed', tsunami_potential: false,
    felt_intensity: 1, p_wave_arrival: 28, s_wave_arrival: 65,
  },
  {
    id: 'EQ-2026-018', magnitude: 5.0, depth: 30, latitude: -0.9234, longitude: 131.0567,
    location: 'Papua Barat', region: '45 km Timur Laut Sorong',
    timestamp: hoursAgo(16), status: 'reviewed', tsunami_potential: false,
    felt_intensity: 3, p_wave_arrival: 12, s_wave_arrival: 29,
  },
  {
    id: 'EQ-2026-019', magnitude: 4.4, depth: 52, latitude: -3.2345, longitude: 114.5678,
    location: 'Kalimantan Selatan', region: '120 km Timur Laut Banjarmasin',
    timestamp: hoursAgo(18), status: 'reviewed', tsunami_potential: false,
    felt_intensity: 2, p_wave_arrival: 17, s_wave_arrival: 40,
  },
  {
    id: 'EQ-2026-020', magnitude: 7.4, depth: 8, latitude: -4.5678, longitude: 96.2345,
    location: 'Aceh', region: 'Samudera Hindia, 145 km Barat Daya Aceh Jaya',
    timestamp: hoursAgo(20), status: 'reviewed', tsunami_potential: true,
    felt_intensity: 7, p_wave_arrival: 4, s_wave_arrival: 10,
  },
];

export const warningAlerts: WarningAlert[] = [
  {
    id: 'WA-001', level: 'critical', title: 'PERINGATAN TSUNAMI',
    message: 'Gempa M7.1 di Laut Sawu - Potensi tsunami. Segera evakuasi ke dataran tinggi!',
    timestamp: hoursAgo(1), earthquake_id: 'EQ-2026-003', estimated_arrival: 180,
  },
  {
    id: 'WA-002', level: 'danger', title: 'GEMPA BUMI KUAT',
    message: 'Gempa M6.4 di Garut - Guncangan kuat terasa. Lindungi kepala Anda!',
    timestamp: minutesAgo(45), earthquake_id: 'EQ-2026-002', estimated_arrival: 19,
  },
  {
    id: 'WA-003', level: 'warning', title: 'GEMPA BUMI SEDANG',
    message: 'Gempa M5.8 di Bali - Guncangan sedang. Waspada guncangan susulan.',
    timestamp: minutesAgo(12), earthquake_id: 'EQ-2026-001', estimated_arrival: 28,
  },
  {
    id: 'WA-004', level: 'info', title: 'INFO GEMPA',
    message: 'Gempa M4.2 di Sulawesi Utara - Tidak berpotensi tsunami.',
    timestamp: hoursAgo(2), earthquake_id: 'EQ-2026-004',
  },
  {
    id: 'WA-005', level: 'danger', title: 'GEMPA BUMI KUAT',
    message: 'Gempa M6.8 di Laut Jawa - Guncangan kuat di Semarang dan sekitarnya.',
    timestamp: hoursAgo(4), earthquake_id: 'EQ-2026-006', estimated_arrival: 21,
  },
  {
    id: 'WA-006', level: 'info', title: 'INFO GEMPA',
    message: 'Gempa M3.9 di Jakarta - Guncangan ringan, tidak berpotensi tsunami.',
    timestamp: hoursAgo(7), earthquake_id: 'EQ-2026-009',
  },
];

// ============================================================
// 100 STASIUN SEISMIK BMKG - DISEBAR KE SELURUH INDONESIA
// FOKUS: MALUKU (20) & SULAWESI UTARA (18)
// ============================================================
export const monitoringStations: StationData[] = [
  // ========== SULAWESI UTARA (18 stasiun) ==========
  { id: 'ST-SUT-001', name: 'BMKG Manado', latitude: 1.4748, longitude: 124.8421, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-SUT-002', name: 'BMKG Bitung', latitude: 1.4404, longitude: 125.1217, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-SUT-003', name: 'BMKG Kotamobagu', latitude: 0.7244, longitude: 124.3178, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-SUT-004', name: 'BMKG Bolaang Mongondow', latitude: 0.7244, longitude: 124.0022, status: 'active', last_signal: minutesAgo(3) },
  { id: 'ST-SUT-005', name: 'BMKG Minahasa', latitude: 1.3167, longitude: 124.9167, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-SUT-006', name: 'BMKG Bolaang Mongondow Selatan', latitude: 0.4333, longitude: 123.7333, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-SUT-007', name: 'BMKG Minahasa Utara', latitude: 1.4833, longitude: 125.0500, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-SUT-008', name: 'BMKG Minahasa Tenggara', latitude: 1.1167, longitude: 124.6667, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-SUT-009', name: 'BMKG Bolaang Mongondow Timur', latitude: 0.7667, longitude: 124.5333, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-SUT-010', name: 'BMKG Bolaang Mongondow Utara', latitude: 1.0167, longitude: 123.4333, status: 'active', last_signal: minutesAgo(3) },
  { id: 'ST-SUT-011', name: 'BMKG Minahasa Selatan', latitude: 1.1667, longitude: 124.5667, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-SUT-012', name: 'BMKG Kepulauan Sangihe', latitude: 2.0500, longitude: 125.4833, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-SUT-013', name: 'BMKG Kepulauan Talaud', latitude: 3.7000, longitude: 126.7167, status: 'active', last_signal: minutesAgo(4) },
  { id: 'ST-SUT-014', name: 'BMKG Kepulauan Siau Tagulandang Biaro', latitude: 2.1167, longitude: 124.6667, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-SUT-015', name: 'BMKG Bolaang Uki', latitude: 0.8833, longitude: 124.0167, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-SUT-016', name: 'BMKG Likupang', latitude: 1.6167, longitude: 125.0000, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-SUT-017', name: 'BMKG Tomohon', latitude: 1.3244, longitude: 124.8333, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-SUT-018', name: 'BMKG Tahuna', latitude: 2.0833, longitude: 125.5333, status: 'maintenance', last_signal: hoursAgo(1) },

  // ========== MALUKU (20 stasiun) ==========
  { id: 'ST-MLK-001', name: 'BMKG Ambon', latitude: -3.6954, longitude: 128.1814, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-MLK-002', name: 'BMKG Tual', latitude: -5.6500, longitude: 132.7500, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-MLK-003', name: 'BMKG Ternate', latitude: 0.7956, longitude: 127.3821, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-MLK-004', name: 'BMKG Tidore', latitude: 0.6000, longitude: 127.4000, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-MLK-005', name: 'BMKG Pulau Buru', latitude: -3.3333, longitude: 126.6833, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-MLK-006', name: 'BMKG Seram Bagian Barat', latitude: -3.1000, longitude: 128.4000, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-MLK-007', name: 'BMKG Seram Bagian Timur', latitude: -3.2833, longitude: 130.5167, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-MLK-008', name: 'BMKG Kepulauan Aru', latitude: -6.1000, longitude: 134.5000, status: 'active', last_signal: minutesAgo(3) },
  { id: 'ST-MLK-009', name: 'BMKG Maluku Tenggara', latitude: -5.7500, longitude: 132.7000, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-MLK-010', name: 'BMKG Maluku Tengah', latitude: -3.3000, longitude: 129.4000, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-MLK-011', name: 'BMKG Halmahera Barat', latitude: 1.4000, longitude: 127.5500, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-MLK-012', name: 'BMKG Halmahera Selatan', latitude: 0.4333, longitude: 127.8500, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-MLK-013', name: 'BMKG Halmahera Tengah', latitude: 0.5500, longitude: 128.3000, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-MLK-014', name: 'BMKG Halmahera Timur', latitude: 1.1833, longitude: 128.5500, status: 'active', last_signal: minutesAgo(3) },
  { id: 'ST-MLK-015', name: 'BMKG Halmahera Utara', latitude: 2.0500, longitude: 127.5833, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-MLK-016', name: 'BMKG Kepulauan Sula', latitude: -1.8333, longitude: 125.6833, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-MLK-017', name: 'BMKG Pulau Obi', latitude: -1.5500, longitude: 127.6000, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-MLK-018', name: 'BMKG Kepulauan Kai', latitude: -5.7000, longitude: 132.7333, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-MLK-019', name: 'BMKG Banda', latitude: -4.5333, longitude: 129.9000, status: 'maintenance', last_signal: hoursAgo(2) },
  { id: 'ST-MLK-020', name: 'BMKG Masohi', latitude: -3.3500, longitude: 128.9500, status: 'active', last_signal: minutesAgo(1) },

  // ========== SULAWESI TENGAH (6) ==========
  { id: 'ST-STG-001', name: 'BMKG Palu', latitude: -0.8917, longitude: 119.8707, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-STG-002', name: 'BMKG Poso', latitude: -1.3833, longitude: 120.7500, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-STG-003', name: 'BMKG Donggala', latitude: -0.7667, longitude: 119.7333, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-STG-004', name: 'BMKG Banggai', latitude: -1.5833, longitude: 122.7833, status: 'active', last_signal: minutesAgo(3) },
  { id: 'ST-STG-005', name: 'BMKG Buol', latitude: 1.0833, longitude: 121.4167, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-STG-006', name: 'BMKG Parigi Moutong', latitude: 0.3500, longitude: 120.1833, status: 'active', last_signal: minutesAgo(2) },

  // ========== SULAWESI SELATAN (5) ==========
  { id: 'ST-SSL-001', name: 'BMKG Makassar', latitude: -5.1477, longitude: 119.4327, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-SSL-002', name: 'BMKG Parepare', latitude: -4.0167, longitude: 119.6167, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-SSL-003', name: 'BMKG Palopo', latitude: -2.9833, longitude: 120.2000, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-SSL-004', name: 'BMKG Sinjai', latitude: -5.1333, longitude: 120.2500, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-SSL-005', name: 'BMKG Bulukumba', latitude: -5.5500, longitude: 120.2000, status: 'active', last_signal: minutesAgo(1) },

  // ========== SULAWESI TENGGARA (4) ==========
  { id: 'ST-STR-001', name: 'BMKG Kendari', latitude: -3.9617, longitude: 122.5100, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-STR-002', name: 'BMKG Bau-Bau', latitude: -5.4667, longitude: 122.6167, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-STR-003', name: 'BMKG Muna', latitude: -4.9333, longitude: 122.6167, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-STR-004', name: 'BMKG Kolaka', latitude: -4.0333, longitude: 121.5833, status: 'active', last_signal: minutesAgo(3) },

  // ========== GORONTALO (2) ==========
  { id: 'ST-GOR-001', name: 'BMKG Gorontalo', latitude: 0.5333, longitude: 123.0500, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-GOR-002', name: 'BMKG Bone Bolango', latitude: 0.5833, longitude: 123.1833, status: 'active', last_signal: minutesAgo(2) },

  // ========== JAWA (12) ==========
  { id: 'ST-JW-001', name: 'BMKG Jakarta', latitude: -6.2088, longitude: 106.8456, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-JW-002', name: 'BMKG Bandung', latitude: -6.9175, longitude: 107.6191, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-JW-003', name: 'BMKG Surabaya', latitude: -7.2575, longitude: 112.7521, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-JW-004', name: 'BMKG Semarang', latitude: -6.9667, longitude: 110.4167, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-JW-005', name: 'BMKG Yogyakarta', latitude: -7.7956, longitude: 110.3694, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-JW-006', name: 'BMKG Malang', latitude: -7.9778, longitude: 112.6306, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-JW-007', name: 'BMKG Cirebon', latitude: -6.7320, longitude: 108.5523, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-JW-008', name: 'BMKG Banyuwangi', latitude: -8.2167, longitude: 114.3500, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-JW-009', name: 'BMKG Tasikmalaya', latitude: -7.3333, longitude: 108.2167, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-JW-010', name: 'BMKG Serang', latitude: -6.1167, longitude: 106.1500, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-JW-011', name: 'BMKG Jember', latitude: -8.1667, longitude: 113.7000, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-JW-012', name: 'BMKG Garut', latitude: -7.2167, longitude: 107.9000, status: 'active', last_signal: minutesAgo(1) },

  // ========== SUMATERA (10) ==========
  { id: 'ST-SM-001', name: 'BMKG Medan', latitude: 3.5952, longitude: 98.6722, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-SM-002', name: 'BMKG Padang', latitude: -0.9471, longitude: 100.4172, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-SM-003', name: 'BMKG Aceh Besar', latitude: 5.5479, longitude: 95.3222, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-SM-004', name: 'BMKG Padangsidimpuan', latitude: 1.4486, longitude: 99.2725, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-SM-005', name: 'BMKG Bengkulu', latitude: -3.8000, longitude: 102.2500, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-SM-006', name: 'BMKG Lampung', latitude: -5.4500, longitude: 105.2667, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-SM-007', name: 'BMKG Pekanbaru', latitude: 0.5000, longitude: 101.4500, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-SM-008', name: 'BMKG Jambi', latitude: -1.6000, longitude: 103.6000, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-SM-009', name: 'BMKG Palembang', latitude: -2.9833, longitude: 104.7500, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-SM-010', name: 'BMKG Nias', latitude: 1.1000, longitude: 97.5500, status: 'active', last_signal: minutesAgo(1) },

  // ========== BALI & NTB (5) ==========
  { id: 'ST-BNTB-001', name: 'BMKG Denpasar', latitude: -8.6705, longitude: 115.2126, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-BNTB-002', name: 'BMKG Mataram', latitude: -8.5833, longitude: 116.1167, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-BNTB-003', name: 'BMKG Bima', latitude: -8.4667, longitude: 118.7333, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-BNTB-004', name: 'BMKG Sumbawa', latitude: -8.5333, longitude: 117.4333, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-BNTB-005', name: 'BMKG Singaraja', latitude: -8.1167, longitude: 115.0833, status: 'active', last_signal: minutesAgo(2) },

  // ========== NTT (5) ==========
  { id: 'ST-NTT-001', name: 'BMKG Kupang', latitude: -10.1772, longitude: 123.6371, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-NTT-002', name: 'BMKG Maumere', latitude: -8.6167, longitude: 122.2167, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-NTT-003', name: 'BMKG Ende', latitude: -8.8333, longitude: 121.6500, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-NTT-004', name: 'BMKG Atambua', latitude: -9.1000, longitude: 124.8833, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-NTT-005', name: 'BMKG Sumba', latitude: -9.6333, longitude: 119.4500, status: 'active', last_signal: minutesAgo(1) },

  // ========== KALIMANTAN (5) ==========
  { id: 'ST-KL-001', name: 'BMKG Balikpapan', latitude: -1.2667, longitude: 116.8333, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-KL-002', name: 'BMKG Banjarmasin', latitude: -3.3167, longitude: 114.5833, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-KL-003', name: 'BMKG Pontianak', latitude: -0.0167, longitude: 109.3333, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-KL-004', name: 'BMKG Samarinda', latitude: -0.5000, longitude: 117.1500, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-KL-005', name: 'BMKG Tarakan', latitude: 3.3000, longitude: 117.6167, status: 'active', last_signal: minutesAgo(2) },

  // ========== PAPUA (6) ==========
  { id: 'ST-PP-001', name: 'BMKG Jayapura', latitude: -2.5916, longitude: 140.6690, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-PP-002', name: 'BMKG Sorong', latitude: -0.8762, longitude: 131.2870, status: 'active', last_signal: minutesAgo(2) },
  { id: 'ST-PP-003', name: 'BMKG Biak', latitude: -1.1833, longitude: 136.0833, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-PP-004', name: 'BMKG Merauke', latitude: -8.5000, longitude: 140.4000, status: 'active', last_signal: minutesAgo(3) },
  { id: 'ST-PP-005', name: 'BMKG Manokwari', latitude: -0.8667, longitude: 134.0667, status: 'active', last_signal: minutesAgo(1) },
  { id: 'ST-PP-006', name: 'BMKG Timika', latitude: -4.5500, longitude: 136.8833, status: 'active', last_signal: minutesAgo(2) },
];

export const seismicWaveData = {
  p_wave_speed: 6.5,
  s_wave_speed: 3.7,
  surface_wave_speed: 3.0,
};

export const magnitudeScale = [
  { range: '< 2.0', label: 'Mikro', color: '#22c55e', description: 'Tidak terasa' },
  { range: '2.0 - 3.9', label: 'Minor', color: '#84cc16', description: 'Terasa oleh beberapa orang' },
  { range: '4.0 - 4.9', label: 'Ringan', color: '#eab308', description: 'Terasa oleh banyak orang' },
  { range: '5.0 - 5.9', label: 'Moderat', color: '#f97316', description: 'Dapat menyebabkan kerusakan ringan' },
  { range: '6.0 - 6.9', label: 'Kuat', color: '#ef4444', description: 'Dapat menyebabkan kerusakan signifikan' },
  { range: '7.0 - 7.9', label: 'Mayor', color: '#dc2626', description: 'Kerusakan luas' },
  { range: '8.0+', label: 'Hebat', color: '#991b1b', description: 'Kerusakan total di area luas' },
];

export function generateNewEarthquake(): Earthquake {
  const locations = [
    { name: 'Sulawesi Utara', lat: 1.3, lng: 124.8, region: 'Zona Sesar Sulawesi' },
    { name: 'Maluku', lat: -3.5, lng: 128.0, region: 'Zona Subduksi Banda' },
    { name: 'NTB', lat: -8.5, lng: 116.5, region: 'Zona Subduksi Sunda' },
    { name: 'NTT', lat: -9.5, lng: 120.0, region: 'Laut Sawu' },
    { name: 'Papua', lat: -2.0, lng: 138.0, region: 'Zona Sesar Aktif Papua' },
    { name: 'Banten', lat: -6.5, lng: 105.5, region: 'Zona Megathrust Sunda' },
    { name: 'Lampung', lat: -5.5, lng: 105.0, region: 'Zona Subduksi Sunda' },
    { name: 'Bengkulu', lat: -3.8, lng: 101.5, region: 'Zona Megathrust' },
    { name: 'Aceh', lat: 4.5, lng: 96.0, region: 'Samudera Hindia' },
    { name: 'Halmahera', lat: 1.5, lng: 128.0, region: 'Zona Subduksi Halmahera' },
    { name: 'Sangihe', lat: 2.1, lng: 125.5, region: 'Zona Subduksi Sangihe' },
    { name: 'Manado', lat: 1.5, lng: 125.0, region: 'Zona Palung Manado' },
    { name: 'Ambon', lat: -3.7, lng: 128.2, region: 'Sesar Aktif Ambon' },
    { name: 'Seram', lat: -3.2, lng: 129.5, region: 'Zona Deformasi Seram' },
    { name: 'Palu', lat: -0.9, lng: 119.9, region: 'Sesar Palu-Koro' },
  ];

  const loc = locations[Math.floor(Math.random() * locations.length)];
  const magnitude = 3.0 + Math.random() * 4.5;
  const depth = Math.floor(8 + Math.random() * 80);
  const pWave = Math.floor(5 + Math.random() * 25);
  const sWave = pWave + Math.floor(8 + Math.random() * 30);

  return {
    id: `EQ-${Date.now()}`,
    magnitude: Math.round(magnitude * 10) / 10,
    depth,
    latitude: loc.lat + (Math.random() - 0.5) * 2,
    longitude: loc.lng + (Math.random() - 0.5) * 2,
    location: loc.name,
    region: loc.region,
    timestamp: new Date().toISOString(),
    status: Math.random() > 0.3 ? 'automatic' : 'preliminary',
    tsunami_potential: magnitude >= 7.0 && depth < 30,
    felt_intensity: Math.max(1, Math.floor(magnitude - 2)),
    p_wave_arrival: pWave,
    s_wave_arrival: sWave,
  };
}
