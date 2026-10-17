import { Activity, Ruler, Scale, Thermometer } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { StatisticsSummary } from '@/types/statistics';

interface StatisticsCardsProps {
  summary: StatisticsSummary;
}

function getBloodPressureMeta(systolic?: number, diastolic?: number, pulse?: number) {
  if (systolic === undefined || diastolic === undefined) {
    return {
      badge: 'No Data',
      subtext: 'Record your first reading'
    };
  }
  const isNormal = systolic < 120 && diastolic < 80;
  const isElevated = systolic < 140 && diastolic < 90;
  const statusLabel = isNormal ? 'Optimal' : isElevated ? 'Normal' : 'Elevated';
  return {
    badge: isNormal ? 'Normal' : statusLabel,
    subtext: `Pulse: ${pulse ?? '--'} bpm · ${statusLabel}`
  };
}

function getWeightSubtext(
  latestWeight?: { weight: number; recordDate: Date | string } | null,
  weightTrend?: { weight: number }[]
) {
  if (!latestWeight) {
    return 'Keep track of your weight';
  }
  if (weightTrend && weightTrend.length >= 2) {
    const earliest = weightTrend[weightTrend.length - 1];
    if (earliest) {
      const diff = Number((latestWeight.weight - earliest.weight).toFixed(1));
      const sign = diff > 0 ? '+' : '';
      return `${sign}${diff} kg vs last 30 days`;
    }
  }
  return new Date(latestWeight.recordDate).toLocaleDateString();
}

function getHeightSubtext(
  latestHeight?: { height: number; recordDate: string } | null,
  latestWeight?: { weight: number } | null
) {
  if (!latestHeight) {
    return 'Update your profile';
  }
  if (latestWeight && latestHeight.height > 0) {
    const heightM = latestHeight.height / 100;
    const bmi = latestWeight.weight / (heightM * heightM);
    const range =
      bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal range' : 'Overweight';
    return `BMI ${bmi.toFixed(1)} · ${range}`;
  }
  return new Date(latestHeight.recordDate).toLocaleDateString();
}

export function StatisticsCards({ summary }: StatisticsCardsProps) {
  const {
    latestBloodPressure,
    latestWeight,
    latestTemperature,
    latestHeight,
    weightTrend
  } = summary;

  const bpMeta = getBloodPressureMeta(
    latestBloodPressure?.systolicBloodPressure,
    latestBloodPressure?.diastolicBloodPressure,
    latestBloodPressure?.pulse
  );

  const vitals = [
    {
      title: 'Blood Pressure',
      value: latestBloodPressure
        ? `${latestBloodPressure.systolicBloodPressure}/${latestBloodPressure.diastolicBloodPressure}`
        : 'No data',
      unit: 'mmHg',
      subtext: bpMeta.subtext,
      badge: bpMeta.badge,
      icon: Activity,
      iconColor: 'text-rose-500',
      badgeClass:
        'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400'
    },
    {
      title: 'Weight',
      value: latestWeight ? latestWeight.weight.toString() : 'No data',
      unit: 'kg',
      subtext: getWeightSubtext(latestWeight, weightTrend),
      badge: latestWeight ? 'On Track' : 'No Data',
      icon: Scale,
      iconColor: 'text-blue-500',
      badgeClass:
        'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Temperature',
      value: latestTemperature
        ? latestTemperature.temperature.toString()
        : 'No data',
      unit: '°C',
      subtext: latestTemperature
        ? 'Stable baseline reading'
        : 'Monitor your health',
      badge: latestTemperature ? 'Healthy' : 'No Data',
      icon: Thermometer,
      iconColor: 'text-orange-500',
      badgeClass:
        'border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Height',
      value: latestHeight ? latestHeight.height.toString() : 'No data',
      unit: 'cm',
      subtext: getHeightSubtext(latestHeight, latestWeight),
      badge: latestHeight ? 'Recorded' : 'No Data',
      icon: Ruler,
      iconColor: 'text-emerald-500',
      badgeClass:
        'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    }
  ];

  return (
    <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {vitals.map(vital => (
        <Card
          key={vital.title}
          className="from-primary/5 to-card bg-gradient-to-t py-4 shadow-xs"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-2">
            <CardTitle className="text-xs font-medium">{vital.title}</CardTitle>
            <div className="border-border/80 bg-background/80 flex size-7 items-center justify-center rounded-md border">
              <vital.icon className={cn('size-4', vital.iconColor)} />
            </div>
          </CardHeader>
          <CardContent className="px-4">
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-2xl font-bold tracking-tight">
                {vital.value}
                <span className="text-muted-foreground ml-1 text-xs font-normal">
                  {vital.unit}
                </span>
              </div>
              <span
                className={cn(
                  'inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium',
                  vital.badgeClass
                )}
              >
                {vital.badge}
              </span>
            </div>
            <p className="text-muted-foreground mt-1.5 text-xs">
              {vital.subtext}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
