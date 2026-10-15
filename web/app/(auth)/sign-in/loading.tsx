import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div
      className="flex flex-col gap-7"
      aria-busy="true"
      aria-label="Loading sign in form"
    >
      <div className="space-y-2.5">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-9 w-64 rounded-xl" />
        <Skeleton className="h-4 w-full max-w-xs rounded-lg" />
      </div>

      <div className="space-y-5 rounded-3xl border border-stone-200/70 bg-white/85 p-6 sm:p-7 dark:border-stone-800/80 dark:bg-stone-900/70">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-3.5 w-24 rounded-md" />
          </div>
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>

      <Skeleton className="mx-auto h-4 w-48 rounded-md" />
    </div>
  );
}
