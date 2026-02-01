import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in duration-500">
      {/* <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border bg-white p-5 shadow-sm dark:bg-zinc-900">
            <Skeleton className="h-4 w-24 mb-3" />  
            <Skeleton className="h-8 w-16 mb-2" />  
            <Skeleton className="h-3 w-32" />      
          </div>
        ))}
      </section> */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="rounded-2xl border bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:bg-zinc-900 overflow-hidden">
          <div className="grid grid-cols-5 gap-4 border-b bg-slate-50/50 px-8 py-5 dark:bg-zinc-800/40">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20 justify-self-center" />
            <Skeleton className="h-4 w-20 justify-self-center" />
            <Skeleton className="h-4 w-28 justify-self-end" />
          </div>

          <div className="divide-y divide-slate-50 dark:divide-zinc-800">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 px-8 py-6 items-center">
                <Skeleton className="h-4 w-10" />
              
                <Skeleton className="h-6 w-20 rounded-full" />
                
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-4 w-32 justify-self-end" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}