import { getUserBloodPressures } from '@/components/actions/user-blood-pressure';
import { BloodPressureTable } from '@/components/blood-pressure-table';

export default async function Page() {
  const bloodPressures = await getUserBloodPressures();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-semibold tracking-tight">Recent Blood Pressure Records</h2>
        <p className="text-sm text-muted-foreground">Showing last 20 records</p>
      </div>
      <div className="rounded-2xl border bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:bg-zinc-900 dark:shadow-none overflow-hidden">
        <BloodPressureTable bloodPressures={bloodPressures ?? []}/>
      </div>
    </div>
  );
}
