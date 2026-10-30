import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeftIcon, CompassIcon, LeafIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Page not found · Health Master'
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#FAF8F5] px-6 py-16 dark:bg-stone-950">
      {/* Soft diffused ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 h-72 w-96 rounded-full bg-amber-100/35 blur-3xl dark:bg-emerald-950/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 left-1/4 h-72 w-96 rounded-full bg-emerald-100/25 blur-3xl dark:bg-stone-900/40"
      />

      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/5 px-3 py-1 text-xs font-medium text-[#3F6254] dark:bg-emerald-400/10 dark:text-emerald-300">
            <CompassIcon className="size-3.5" aria-hidden="true" />
            <span>A Gentle Pause</span>
          </div>

          <p
            aria-hidden="true"
            className="text-7xl font-medium tracking-tight text-stone-200 select-none sm:text-8xl dark:text-stone-800"
          >
            404
          </p>

          <div className="space-y-2.5">
            <h1 className="text-2xl font-medium tracking-tight text-stone-800 sm:text-3xl dark:text-stone-100">
              This page has{' '}
              <span className="font-serif italic">wandered off</span> the path
            </h1>
            <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
              The page you are looking for may have been moved, renamed, or
              never existed. Take a slow breath, and let us walk you back to
              calmer ground.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({}),
              'h-11 gap-2 rounded-xl bg-[#3F6254] px-6 text-sm font-medium text-stone-50 shadow-xs transition-all duration-300 hover:bg-[#345246] dark:bg-emerald-700 dark:text-stone-50 dark:hover:bg-emerald-600'
            )}
          >
            <LeafIcon className="size-4" aria-hidden="true" />
            <span>Return to your space</span>
          </Link>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'h-11 rounded-full px-5 text-xs font-medium text-stone-500 hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800/60 dark:hover:text-stone-200'
            )}
          >
            <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
