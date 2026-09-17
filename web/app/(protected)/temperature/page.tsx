import { getUserTemperatures } from '@/components/actions/user-temperature';
import { UserTemperatureRecords } from '@/components/user-temperature-records';

export default async function Page() {
  const userTemperatures = await getUserTemperatures();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-semibold tracking-tight">
          Recent Temperature Records
        </h2>
        <p className="text-sm text-muted-foreground">
          Monitoring your body temperature
        </p>
      </div>
      <UserTemperatureRecords userTemperatures={userTemperatures ?? []} />
    </div>
  )
}
