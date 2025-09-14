import React, { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { SensorData } from '@/types';

interface LiveSensorChartProps {
  sensor: SensorData;
  data?: Array<{ time: string; value: number; timestamp: number }>;
}

export const LiveSensorChart: React.FC<LiveSensorChartProps> = ({ sensor, data }) => {
  // Generate mock historical data if not provided
  const chartData = useMemo(() => {
    if (data) return data;
    
    const now = Date.now();
    const points = 20;
    const baseValue = sensor.value;
    const variance = baseValue * 0.15; // 15% variance
    
    return Array.from({ length: points }, (_, i) => {
      const timestamp = now - (points - i) * 30000; // 30 seconds apart
      const randomVariance = (Math.random() - 0.5) * variance;
      let value = baseValue + randomVariance;
      
      // Add some trend based on sensor trend
      if (sensor.trend === 'up') {
        value = baseValue + (i / points) * variance + randomVariance;
      } else if (sensor.trend === 'down') {
        value = baseValue - (i / points) * variance + randomVariance;
      }
      
      return {
        time: new Date(timestamp).toLocaleTimeString('en-US', { 
          hour12: false, 
          minute: '2-digit', 
          second: '2-digit' 
        }),
        value: Math.max(0, Number(value.toFixed(1))),
        timestamp
      };
    });
  }, [sensor.value, sensor.trend, data]);

  const chartConfig = {
    value: {
      label: sensor.name,
      color: sensor.status === 'critical' ? 'hsl(var(--alert-high))' :
             sensor.status === 'warning' ? 'hsl(var(--alert-medium))' :
             'hsl(var(--primary))',
    },
  };

  return (
    <div className="h-12 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={chartConfig.value.color}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};