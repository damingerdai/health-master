import { getUserWeights } from '@/components/actions/user-weights';
import { WeightTable } from '@/components/weight-table';

export default async function Page() {
  const userWeights = await getUserWeights();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-semibold tracking-tight">
          Recent Weight Records
        </h2>
        <p className="text-sm text-muted-foreground">
          Showing your weight history
        </p>
      </div>
      <WeightTable userWeights={userWeights ?? []}/>
    </div>
  );
}
