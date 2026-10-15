import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div
      className="flex flex-col gap-7"
      aria-busy="true"
      aria-label="Loading two-factor verification"
    >
      <div className="space-y-2.5">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-9 w-64 rounded-xl" />
        <Skeleton className="h-4 w-full max-w-xs rounded-lg" />
      </div>

      <div className="space-y-6 rounded-3xl border border-stone-200/70 bg-white/85 p-6 sm:p-7 dark:border-stone-800/80 dark:bg-stone-900/70">
        <div className="space-y-3 text-center">
          <Skeleton className="mx-auto h-4 w-36 rounded-md" />
          <div className="flex justify-center gap-2 sm:gap-2.5">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="size-11 rounded-xl sm:size-12" />
            ))}
          </div>
          <Skeleton className="mx-auto h-3.5 w-52 rounded-md" />
        </div>
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>

      <Skeleton className="mx-auto h-8 w-32 rounded-full" />
    </div>
  );
}
