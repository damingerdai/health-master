import {
  IconActivity,
  IconScale,
  IconTemperature,
  IconRuler2
} from '@tabler/icons-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction
} from '@/components/ui/card';
import { StatisticsSummary } from '@/types/statistics';
import { Badge } from './ui/badge';

interface StatisticsCardsProps {
  summary: StatisticsSummary;
}

export function StatisticsCards({ summary }: StatisticsCardsProps) {
  const { latestBloodPressure, latestWeight, latestTemperature, latestHeight } =
    summary;

  const cards = [
    {
      title: 'Blood Pressure',
      value: latestBloodPressure
        ? `${latestBloodPressure.systolicBloodPressure}/${latestBloodPressure.diastolicBloodPressure}`
        : 'No data',
      unit: 'mmHg',
      description: latestBloodPressure
        ? `Pulse: ${latestBloodPressure.pulse} bpm`
        : 'Record your first reading',
      icon: IconActivity,
      color: 'text-rose-500'
    },
    {
      title: 'Weight',
      value: latestWeight ? latestWeight.weight.toString() : 'No data',
      unit: 'kg',
      description: latestWeight
        ? new Date(latestWeight.recordDate).toLocaleDateString()
        : 'Keep track of your weight',
      icon: IconScale,
      color: 'text-blue-500'
    },
    {
      title: 'Temperature',
      value: latestTemperature
        ? latestTemperature.temperature.toString()
        : 'No data',
      unit: '°C',
      description: latestTemperature
        ? new Date(latestTemperature.recordDate).toLocaleDateString()
        : 'Monitor your health',
      icon: IconTemperature,
      color: 'text-orange-500'
    },
    {
      title: 'Height',
      value: latestHeight ? latestHeight.height.toString() : 'No data',
      unit: 'cm',
      description: latestHeight
        ? new Date(latestHeight.recordDate).toLocaleDateString()
        : 'Update your profile',
      icon: IconRuler2,
      color: 'text-emerald-500'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      {cards.map(card => (
        <Card key={card.title} className="@container/card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <CardAction>
              <Badge variant="outline">
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {card.value}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                {card.unit}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
