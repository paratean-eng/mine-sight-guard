import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { SensorData } from '@/types';
import { mockSensorData } from '@/data/mockData';
import { Calendar, BarChart3 } from 'lucide-react';

interface GraphicalDataPanelProps {
  sensorData: SensorData[];
}

type TimeRange = '1h' | '6h' | '24h' | 'custom';
type SensorType = 'all' | 'temperature' | 'co2' | 'noise' | 'vibration';

const timeRangeOptions = [
  { value: '1h', label: 'Last 1 Hour' },
  { value: '6h', label: 'Last 6 Hours' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: 'custom', label: 'Custom Range' },
];

const sensorOptions = [
  { value: 'all', label: 'All Sensors' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'co2', label: 'CO₂ Levels' },
  { value: 'noise', label: 'Noise Level' },
  { value: 'vibration', label: 'Vibration' },
];

export const GraphicalDataPanel: React.FC<GraphicalDataPanelProps> = ({ sensorData }) => {
  const [selectedSensor, setSelectedSensor] = useState<SensorType>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('6h');

  // Generate historical data for charts
  const chartData = useMemo(() => {
    const hours = timeRange === '1h' ? 1 : timeRange === '6h' ? 6 : 24;
    const dataPoints = hours * 6; // Every 10 minutes
    const now = Date.now();
    
    return Array.from({ length: dataPoints }, (_, i) => {
      const timestamp = now - (dataPoints - i) * 10 * 60 * 1000; // 10 minutes apart
      const time = new Date(timestamp);
      
      const dataPoint: any = {
        time: time.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        timestamp,
        fullTime: time.toLocaleString(),
      };

      // Add sensor data with realistic variations
      sensorData.forEach(sensor => {
        const baseValue = sensor.value;
        const variance = baseValue * 0.2;
        const trend = Math.sin(i / dataPoints * Math.PI * 2) * variance * 0.5;
        const noise = (Math.random() - 0.5) * variance * 0.3;
        
        let sensorKey = sensor.name.toLowerCase().replace(/[^a-z]/g, '');
        if (sensorKey.includes('co2')) sensorKey = 'co2';
        if (sensorKey.includes('temperature')) sensorKey = 'temperature';
        if (sensorKey.includes('noise')) sensorKey = 'noise';
        if (sensorKey.includes('vibration')) sensorKey = 'vibration';
        
        dataPoint[sensorKey] = Math.max(0, Number((baseValue + trend + noise).toFixed(1)));
      });

      return dataPoint;
    });
  }, [sensorData, timeRange]);

  const filteredSensorData = useMemo(() => {
    if (selectedSensor === 'all') return sensorData;
    return sensorData.filter(sensor => {
      const sensorType = sensor.name.toLowerCase();
      return sensorType.includes(selectedSensor.replace('co2', 'co'));
    });
  }, [sensorData, selectedSensor]);

  const chartConfig = {
    temperature: {
      label: 'Temperature',
      color: 'hsl(var(--primary))',
    },
    co2: {
      label: 'CO₂ Levels',
      color: 'hsl(var(--alert-medium))',
    },
    noise: {
      label: 'Noise Level',
      color: 'hsl(var(--accent))',
    },
    vibration: {
      label: 'Vibration',
      color: 'hsl(var(--alert-high))',
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Graphical Data Analytics</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Select value={selectedSensor} onValueChange={(value: SensorType) => setSelectedSensor(value)}>
            <SelectTrigger className="w-full sm:w-48 glass-panel">
              <SelectValue placeholder="Select sensor" />
            </SelectTrigger>
            <SelectContent className="bg-background border-glass-border/50">
              {sensorOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
            <SelectTrigger className="w-full sm:w-40 glass-panel">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-glass-border/50">
              {timeRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Chart */}
      <Card className="glass-panel border-glass-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            {selectedSensor === 'all' ? 'All Sensors' : sensorOptions.find(s => s.value === selectedSensor)?.label} - Time Series
            <span className="text-sm font-normal text-muted-foreground">
              ({timeRange === 'custom' ? 'Custom Range' : timeRangeOptions.find(t => t.value === timeRange)?.label})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                  <XAxis 
                    dataKey="time"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                  />
                  
                  {selectedSensor === 'all' ? (
                    // Show all sensors
                    Object.entries(chartConfig).map(([key, config]) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={config.color}
                        strokeWidth={2}
                        dot={false}
                        connectNulls={false}
                      />
                    ))
                  ) : (
                    // Show selected sensor
                    <Line
                      type="monotone"
                      dataKey={selectedSensor === 'co2' ? 'co2' : selectedSensor}
                      stroke={chartConfig[selectedSensor as keyof typeof chartConfig]?.color || 'hsl(var(--primary))'}
                      strokeWidth={3}
                      dot={{ fill: chartConfig[selectedSensor as keyof typeof chartConfig]?.color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: chartConfig[selectedSensor as keyof typeof chartConfig]?.color }}
                    />
                  )}
                  
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => `Time: ${value}`}
                        formatter={(value: any, name: string) => [
                          `${Number(value).toFixed(1)} ${
                            name === 'temperature' ? '°C' :
                            name === 'co2' ? 'ppm' :
                            name === 'noise' ? 'dB' :
                            name === 'vibration' ? 'Hz' : ''
                          }`,
                          chartConfig[name as keyof typeof chartConfig]?.label || name
                        ]}
                      />
                    }
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSensorData.map((sensor) => (
          <Card key={sensor.id} className="glass-panel border-glass-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold text-foreground">
                  {sensor.value} {sensor.unit}
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  sensor.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                  sensor.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {sensor.status.toUpperCase()}
                </div>
              </div>
              <p className="text-sm font-medium text-foreground">{sensor.name}</p>
              <p className="text-xs text-muted-foreground">{sensor.location}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};