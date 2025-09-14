// Mine Monitoring AI Types

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'operator' | 'supervisor' | 'admin';
  avatar?: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'safe';
  timestamp: Date;
  location: string;
  acknowledged: boolean;
  category: 'safety' | 'equipment' | 'environmental' | 'production';
}

export interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  location: string;
  timestamp: Date;
  trend: 'up' | 'down' | 'stable';
}

export interface AINotification {
  id: string;
  message: string;
  timestamp: Date;
  type: 'prediction' | 'alert' | 'info';
  confidence: number;
}

export interface MonitoringMode {
  id: 'live' | 'predictions' | 'historical' | 'manual';
  name: string;
  description: string;
  icon: string;
}

export interface VideoFeed {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  url: string;
  thumbnail: string;
}