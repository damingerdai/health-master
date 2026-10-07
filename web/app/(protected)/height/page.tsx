import { getUserHeights } from '@/components/actions/user-heights';
import { HeightTable } from '@/components/height-table';

export default async function Page() {
  const userHeights = await getUserHeights();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 px-2">
        <h2 className="text-lg font-semibold tracking-tight">
          Recent Height Records
        </h2>
        <p className="text-sm text-muted-foreground">
          Showing your height history
        </p>
      </div>
      <HeightTable userHeights={userHeights ?? []} />
    </div>
  );
}
