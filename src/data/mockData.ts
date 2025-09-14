// Mock data for Mine Monitoring AI

import { Alert, SensorData, AINotification, VideoFeed, User } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Sarah Mitchell',
  email: 'sarah.mitchell@minetech.com',
  role: 'operator',
  avatar: 'SM'
};

export const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Gas Level Warning',
    description: 'Methane levels elevated in Sector 7-B',
    severity: 'medium',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    location: 'Sector 7-B, Level 450m',
    acknowledged: false,
    category: 'safety'
  },
  {
    id: '2',
    title: 'Equipment Vibration Alert',
    description: 'Conveyor belt CB-15 showing abnormal vibration patterns',
    severity: 'high',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    location: 'Main Shaft, CB-15',
    acknowledged: true,
    category: 'equipment'
  },
  {
    id: '3',
    title: 'Production Target Met',
    description: 'Daily extraction quota achieved ahead of schedule',
    severity: 'safe',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    location: 'All Sectors',
    acknowledged: false,
    category: 'production'
  }
];

export const mockSensorData: SensorData[] = [
  {
    id: 'temp-01',
    name: 'Temperature',
    value: 24.5,
    unit: '°C',
    status: 'normal',
    location: 'Sector 7-A',
    timestamp: new Date(),
    trend: 'stable'
  },
  {
    id: 'co2-01',
    name: 'CO2 Levels',
    value: 850,
    unit: 'ppm',
    status: 'normal',
    location: 'Main Tunnel',
    timestamp: new Date(),
    trend: 'down'
  },
  {
    id: 'noise-01',
    name: 'Noise Level',
    value: 78,
    unit: 'dB',
    status: 'warning',
    location: 'Equipment Bay',
    timestamp: new Date(),
    trend: 'up'
  },
  {
    id: 'vibration-01',
    name: 'Vibration',
    value: 12.3,
    unit: 'Hz',
    status: 'critical',
    location: 'Conveyor CB-15',
    timestamp: new Date(),
    trend: 'up'
  }
];

export const mockAINotifications: AINotification[] = [
  {
    id: '1',
    message: 'AI detected potential equipment failure in 4-6 hours based on vibration patterns',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'prediction',
    confidence: 87
  },
  {
    id: '2',
    message: 'Weather update: Rain expected in 2 hours, recommend checking drainage systems',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    type: 'info',
    confidence: 95
  },
  {
    id: '3',
    message: 'Anomaly detected in Sector 7-B gas readings, investigating...',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    type: 'alert',
    confidence: 78
  }
];

export const mockVideoFeeds: VideoFeed[] = [
  {
    id: 'cam-01',
    name: 'Main Entrance',
    location: 'Surface Level',
    status: 'online',
    url: '/api/video/cam-01',
    thumbnail: '/placeholder-camera.jpg'
  },
  {
    id: 'cam-02',
    name: 'Sector 7-A',
    location: '450m Underground',
    status: 'online',
    url: '/api/video/cam-02',
    thumbnail: '/placeholder-camera.jpg'
  },
  {
    id: 'cam-03',
    name: 'Equipment Bay',
    location: 'Main Shaft',
    status: 'maintenance',
    url: '/api/video/cam-03',
    thumbnail: '/placeholder-camera.jpg'
  },
  {
    id: 'cam-04',
    name: 'Conveyor CB-15',
    location: 'Transport Level',
    status: 'offline',
    url: '/api/video/cam-04',
    thumbnail: '/placeholder-camera.jpg'
  }
];

// Simulate real-time data updates
export const generateRandomSensorValue = (sensor: SensorData): SensorData => {
  const variance = sensor.value * 0.1; // 10% variance
  const change = (Math.random() - 0.5) * variance;
  const newValue = Math.max(0, sensor.value + change);
  
  let status: 'normal' | 'warning' | 'critical' = 'normal';
  if (sensor.name === 'Temperature' && newValue > 30) status = 'warning';
  if (sensor.name === 'Temperature' && newValue > 35) status = 'critical';
  if (sensor.name === 'CO2 Levels' && newValue > 1000) status = 'warning';
  if (sensor.name === 'CO2 Levels' && newValue > 1500) status = 'critical';
  if (sensor.name === 'Noise Level' && newValue > 85) status = 'warning';
  if (sensor.name === 'Noise Level' && newValue > 95) status = 'critical';
  if (sensor.name === 'Vibration' && newValue > 15) status = 'warning';
  if (sensor.name === 'Vibration' && newValue > 20) status = 'critical';

  return {
    ...sensor,
    value: Math.round(newValue * 10) / 10,
    status,
    timestamp: new Date(),
    trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
  };
};