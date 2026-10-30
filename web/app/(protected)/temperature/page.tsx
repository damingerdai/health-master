import { getUserTemperatures } from '@/components/actions/user-temperature';
import { UserTemperatureRecords } from '@/components/user-temperature-records';

export default async function Page() {
  const userTemperatures = await getUserTemperatures();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-base font-medium tracking-tight text-stone-800 dark:text-stone-100">
          Recent Temperature Records
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Monitoring your body temperature
        </p>
      </div>
      <UserTemperatureRecords userTemperatures={userTemperatures ?? []} />
    </div>
  );
}
