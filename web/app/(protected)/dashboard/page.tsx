import { StatisticsCards } from '@/components/statistics-cards';
import { HealthCharts } from '@/components/health-charts';
import { getStatisticsSummary } from '@/components/actions/statistics';

export default async function Page() {
  const summary = await getStatisticsSummary();

  if (!summary) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-muted-foreground text-lg">
          Failed to load statistics. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-6 lg:px-6">
      <StatisticsCards summary={summary} />
      <HealthCharts summary={summary} />
    </div>
  );
}
