import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="relative flex flex-1 flex-col px-4 py-8 sm:px-6 md:py-12">
      <div className="mx-auto w-full max-w-xl">
        {/* Back link */}
        <div className="mb-6">
          <Skeleton className="h-7 w-52 rounded-full" />
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col items-center space-y-3 text-center">
          <Skeleton className="size-14 rounded-2xl" />
          <Skeleton className="h-6 w-36 rounded-full" />
          <div className="flex flex-col items-center space-y-1.5">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-stone-200/70 bg-white/85 p-6 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm sm:p-8 md:p-10 dark:border-stone-800/80 dark:bg-stone-900/70">
          <div className="mx-auto max-w-sm">
            <div className="grid gap-8">
              {/* Temperature reading */}
              <div className="space-y-4">
                <Skeleton className="h-4 w-40" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2.5">
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <Skeleton className="h-3.5 w-10" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4 border-t border-stone-200/60 pt-6 dark:border-stone-800/70">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-[100px] w-full rounded-xl" />
              </div>

              {/* Date & time */}
              <div className="grid grid-cols-2 gap-4 border-t border-stone-200/60 pt-6 dark:border-stone-800/70">
                <div className="flex flex-col gap-2.5">
                  <Skeleton className="h-3.5 w-12" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <Skeleton className="h-3.5 w-12" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              </div>

              {/* Submit */}
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>

          {/* Mindful moment note */}
          <div className="mt-8 border-t border-stone-200/70 pt-6 dark:border-stone-800/80">
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
