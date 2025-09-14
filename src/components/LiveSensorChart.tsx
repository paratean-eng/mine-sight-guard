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
    <div className="h-16 w-full mt-3">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartConfig.value.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: chartConfig.value.color }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Time: ${value}`}
                  formatter={(value: any) => [
                    `${Number(value).toFixed(1)} ${sensor.unit}`,
                    sensor.name
                  ]}
                />
              }
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};