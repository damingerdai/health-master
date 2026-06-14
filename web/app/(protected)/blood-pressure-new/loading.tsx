import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col bg-[#f8fafc] dark:bg-zinc-950 min-h-screen animate-in fade-in duration-500">
      <div className="mx-auto w-full max-w-2xl px-4 pt-8 md:px-0">
        <div className="flex items-center gap-2 opacity-50">
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <main className="flex flex-1 items-start justify-center p-4 md:p-10">
        <div className="w-full max-w-xl">
          <div className="mb-8 flex flex-col items-center text-center space-y-4">
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <div className="space-y-2 flex flex-col items-center">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm md:p-10 dark:bg-zinc-900">
            <div className="mx-auto max-w-sm space-y-8">
              
              <div className="space-y-4">
                <Skeleton className="h-4 w-20" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-12 w-full rounded-md" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>

              <Skeleton className="h-12 w-full rounded-md shadow-sm" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}