
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface BarChartProps {
  data: any[];
  xField: string;
  yField: string;
  colors?: string[];
  height?: number;
  showLegend?: boolean;
}

export function BarChart({
  data,
  xField,
  yField,
  colors = ["#2563eb"],
  height = 300,
  showLegend = true,
}: BarChartProps) {
  return (
    <ChartContainer
      config={{
        [yField]: {
          label: yField,
          color: colors[0],
        }
      }}
    >
      <RechartsBarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        height={height}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" vertical={false} />
        <XAxis
          dataKey={xField}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={30}
        />
        <ChartTooltip
          content={({ active, payload, label }) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              label={label}
            />
          )}
        />
        <Bar
          dataKey={yField}
          fill={colors[0]}
          radius={[4, 4, 0, 0]}
          maxBarSize={50}
        />
      </RechartsBarChart>
    </ChartContainer>
  );
}
