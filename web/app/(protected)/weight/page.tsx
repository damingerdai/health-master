import { getUserWeights } from '@/components/actions/user-weights';
import { WeightTable } from '@/components/weight-table';

export default async function Page() {
  const userWeights = await getUserWeights();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-base font-medium tracking-tight text-stone-800 dark:text-stone-100">
          Recent Weight Records
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Showing your weight history
        </p>
      </div>
      <WeightTable userWeights={userWeights ?? []} />
    </div>
  );
}
