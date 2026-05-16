"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { StatisticsSummary } from "@/types/statistics";

interface HealthChartsProps {
  summary: StatisticsSummary;
}

export function HealthCharts({ summary }: HealthChartsProps) {
  const bloodPressureData = [...(summary.bloodPressureTrend ?? [])].reverse().map(item => ({
    date: new Date(item.logDatetime || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    systolic: item.systolicBloodPressure,
    diastolic: item.diastolicBloodPressure,
  }));

  const weightData = [...(summary.weightTrend ?? [])].reverse().map(item => ({
    date: new Date(item.recordDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: item.weight,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Blood Pressure Trend</CardTitle>
          <CardDescription>Systolic vs Diastolic over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
            systolic: { label: "Systolic", color: "hsl(var(--primary))" },
            diastolic: { label: "Diastolic", color: "hsl(var(--secondary))" },
          }} className="h-[300px] w-full">
            <LineChart data={bloodPressureData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line dataKey="systolic" type="monotone" stroke="var(--color-systolic)" strokeWidth={2} dot={false} />
              <Line dataKey="diastolic" type="monotone" stroke="var(--color-diastolic)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weight Trend</CardTitle>
          <CardDescription>Body weight progression</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
            weight: { label: "Weight (kg)", color: "hsl(var(--primary))" },
          }} className="h-[300px] w-full">
            <LineChart data={weightData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line dataKey="weight" type="monotone" stroke="var(--color-weight)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
