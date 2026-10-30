import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-in fade-in duration-500">
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-3.5 w-48" />
        </div>

        <div className="overflow-hidden rounded-3xl border border-stone-200/70 bg-white/85 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm dark:border-stone-800/80 dark:bg-stone-900/70">
          {/* Table header */}
          <div className="grid grid-cols-4 gap-4 border-b border-stone-200/60 bg-stone-50/60 px-8 py-4 dark:border-stone-800/70 dark:bg-stone-900/40">
            <Skeleton className="h-3.5 w-12" />
            <Skeleton className="h-3.5 w-14" />
            <Skeleton className="h-3.5 w-20 justify-self-center" />
            <Skeleton className="h-3.5 w-20 justify-self-end" />
          </div>

          {/* Table rows */}
          <div className="divide-y divide-stone-200/60 dark:divide-stone-800/70">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-4 items-center gap-4 px-8 py-5"
              >
                <Skeleton className="h-3.5 w-6" />

                <Skeleton className="h-5 w-20 rounded-full" />

                <div className="flex flex-col items-center gap-1.5">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-2.5 w-14" />
                </div>
                <Skeleton className="h-3.5 w-28 justify-self-end" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
