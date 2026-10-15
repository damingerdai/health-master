import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div
      className="flex flex-col gap-6"
      aria-busy="true"
      aria-label="Loading sign up form"
    >
      <div className="space-y-2">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-9 w-64 rounded-xl" />
        <Skeleton className="h-4 w-full max-w-xs rounded-lg" />
      </div>

      <div className="space-y-4 rounded-3xl border border-stone-200/70 bg-white/85 p-6 sm:p-7 dark:border-stone-800/80 dark:bg-stone-900/70">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-16 rounded-md" />
          <div className="grid grid-cols-3 gap-2.5">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
        <div className="space-y-4 border-t border-stone-200/60 pt-4 dark:border-stone-800/70">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>

      <Skeleton className="mx-auto h-4 w-48 rounded-md" />
    </div>
  );
}
