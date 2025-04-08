
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface LineChartProps {
  data: any[];
  xField: string;
  yField: string;
  categories: string[];
  colors?: string[];
  height?: number;
  showLegend?: boolean;
}

export function LineChart({
  data,
  xField,
  yField,
  categories,
  colors = ["#2563eb"],
  height = 300,
  showLegend = true,
}: LineChartProps) {
  return (
    <ChartContainer
      config={{
        [yField]: {
          label: yField,
          color: colors[0],
        }
      }}
    >
      <RechartsLineChart
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
        <Line
          type="monotone"
          dataKey={yField}
          stroke={colors[0]}
          strokeWidth={2}
          dot={{ strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </RechartsLineChart>
    </ChartContainer>
  );
}
