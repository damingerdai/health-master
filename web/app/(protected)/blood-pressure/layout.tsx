import * as React from 'react';
import Link from 'next/link';
import { HeartPulse, PlusIcon } from 'lucide-react';
import { AppBreadcrumb } from '@/components/app-breadcrumb';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-stone-200/60 bg-white/55 px-6 py-6 backdrop-blur-xs md:px-10 md:py-8 dark:border-stone-800/70 dark:bg-stone-900/35">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2.5">
            <AppBreadcrumb subTitle="Blood Pressure" />
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50/90 px-3 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/50">
              <HeartPulse className="size-3.5" aria-hidden="true" />
              <span>Calm Heart Rhythm</span>
            </div>
            <div>
              <h1 className="text-2xl font-medium tracking-tight text-stone-800 sm:text-3xl dark:text-stone-100">
                Blood Pressure Journal
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                Listen to your cardiovascular rhythm and gently record your
                daily systolic, diastolic, and pulse readings.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/blood-pressure-new"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#3F6254] px-5 text-sm font-medium text-stone-50 shadow-xs transition-all duration-300 hover:bg-[#345246] focus-visible:ring-2 focus-visible:ring-[#3F6254]/30 focus-visible:outline-none dark:bg-emerald-700 dark:hover:bg-emerald-600"
            >
              <PlusIcon className="size-4" aria-hidden="true" />
              <span>New Reading</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="@container/main mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 md:px-10 md:py-8">
        {children}
      </div>
    </div>
  );
}
