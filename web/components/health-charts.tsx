'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { StatisticsSummary } from '@/types/statistics';

interface HealthChartsProps {
  summary: StatisticsSummary;
}

export function HealthCharts({ summary }: HealthChartsProps) {
  const bloodPressureData = [...(summary.bloodPressureTrend ?? [])]
    .reverse()
    .map(item => ({
      date: new Date(
        item.logDatetime || item.createdAt || ''
      ).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      systolic: item.systolicBloodPressure,
      diastolic: item.diastolicBloodPressure
    }));

  const weightData = [...(summary.weightTrend ?? [])].reverse().map(item => ({
    date: new Date(item.recordDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
    weight: item.weight
  }));

  return (
    <div className="space-y-4">
      {/* Blood Pressure Trend Analysis — matches the dashboard preview in app/page.tsx */}
      <div className="border-border/70 bg-background/60 rounded-xl border p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-sm font-semibold">
              Blood Pressure &amp; Weight Trend Analysis
            </h2>
            <p className="text-muted-foreground text-xs">
              30-day continuous vital sign progression
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-rose-500" />
              Systolic (mmHg)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-blue-500" />
              Diastolic (mmHg)
            </span>
          </div>
        </div>

        <div className="mt-4">
          <ChartContainer
            config={{
              systolic: {
                label: 'Systolic (mmHg)',
                color: 'rgb(244 63 94)'
              },
              diastolic: {
                label: 'Diastolic (mmHg)',
                color: 'rgb(59 130 246)'
              }
            }}
            className="h-56 w-full sm:h-64"
          >
            <AreaChart
              data={bloodPressureData}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="systolicFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="rgb(244 63 94)"
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="100%"
                    stopColor="rgb(244 63 94)"
                    stopOpacity={0.0}
                  />
                </linearGradient>
                <linearGradient id="diastolicFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="rgb(59 130 246)"
                    stopOpacity={0.24}
                  />
                  <stop
                    offset="100%"
                    stopColor="rgb(59 130 246)"
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                strokeOpacity={0.4}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="systolic"
                type="monotone"
                stroke="rgb(244 63 94)"
                fill="url(#systolicFill)"
                strokeWidth={2.5}
                dot={false}
              />
              <Area
                dataKey="diastolic"
                type="monotone"
                stroke="rgb(59 130 246)"
                fill="url(#diastolicFill)"
                strokeWidth={2.5}
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

      {/* Weight Trend Analysis in the same visual container style */}
      <div className="border-border/70 bg-background/60 rounded-xl border p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-sm font-semibold">Weight Trend Analysis</h2>
            <p className="text-muted-foreground text-xs">
              Body weight progression over time
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              Weight (kg)
            </span>
          </div>
        </div>

        <div className="mt-4">
          <ChartContainer
            config={{
              weight: {
                label: 'Weight (kg)',
                color: 'rgb(16 185 129)'
              }
            }}
            className="h-56 w-full sm:h-64"
          >
            <AreaChart
              data={weightData}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="rgb(16 185 129)"
                    stopOpacity={0.24}
                  />
                  <stop
                    offset="100%"
                    stopColor="rgb(16 185 129)"
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                strokeOpacity={0.4}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="weight"
                type="monotone"
                stroke="rgb(16 185 129)"
                fill="url(#weightFill)"
                strokeWidth={2.5}
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
