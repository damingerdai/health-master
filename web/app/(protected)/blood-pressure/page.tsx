import { getUserBloodPressures } from '@/components/actions/user-blood-pressure';
import { BloodPressureTable } from '@/components/blood-pressure-table';

export default async function Page() {
  const bloodPressures = await getUserBloodPressures();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-base font-medium tracking-tight text-stone-800 dark:text-stone-100">
          Recent Blood Pressure Records
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Showing last 20 records
        </p>
      </div>
      <div className="overflow-hidden rounded-3xl border border-stone-200/70 bg-white/85 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm dark:border-stone-800/80 dark:bg-stone-900/70">
        <BloodPressureTable bloodPressures={bloodPressures ?? []} />
      </div>
    </div>
  );
}
