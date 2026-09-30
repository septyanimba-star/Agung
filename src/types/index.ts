export interface Earthquake {
  id: string;
  magnitude: number;
  depth: number;
  latitude: number;
  longitude: number;
  location: string;
  region: string;
  timestamp: string;
  status: 'reviewed' | 'automatic' | 'preliminary';
  tsunami_potential: boolean;
  felt_intensity?: number;
  p_wave_arrival?: number; // seconds
  s_wave_arrival?: number; // seconds
}

export interface WarningAlert {
  id: string;
  level: 'info' | 'warning' | 'danger' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  earthquake_id?: string;
  estimated_arrival?: number; // seconds
}

export interface StationData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive' | 'maintenance';
  last_signal: string;
  sensor_type?: string;
  sensor_model?: string;
  seed_code?: string;
  network?: string;
  sampling_rate?: number;
  channels?: string[];
  elevation?: number;
  installation_date?: string;
  region?: string;
  province?: string;
}
