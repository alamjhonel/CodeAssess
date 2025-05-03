
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Cell, Pie, PieChart as RechartsPieChart } from 'recharts';

interface DoughnutChartProps {
  data: {
    name: string;
    value: number;
  }[];
  colors?: string[];
  height?: number;
}

export function DoughnutChart({
  data,
  colors = ["#2563eb", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b", "#10b981"],
  height = 220,
}: DoughnutChartProps) {
  return (
    <ChartContainer
      config={{
        value: {
          label: 'Value',
          color: colors[0],
        }
      }}
    >
      <RechartsPieChart width={height} height={height}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]}
              stroke="transparent"
            />
          ))}
        </Pie>
        <ChartTooltip
          content={({ active, payload }) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              labelKey="name"
            />
          )}
        />
      </RechartsPieChart>
    </ChartContainer>
  );
}
