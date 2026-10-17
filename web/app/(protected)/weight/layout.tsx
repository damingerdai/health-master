import * as React from 'react';
import Link from 'next/link';
import { PlusIcon, Scale } from 'lucide-react';
import { AppBreadcrumb } from '@/components/app-breadcrumb';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-stone-200/60 bg-white/55 px-6 py-6 backdrop-blur-xs md:px-10 md:py-8 dark:border-stone-800/70 dark:bg-stone-900/35">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2.5">
            <AppBreadcrumb subTitle="Weight" />
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/5 px-3 py-1 text-xs font-medium text-[#3F6254] dark:bg-emerald-400/10 dark:text-emerald-300">
              <Scale className="size-3.5" aria-hidden="true" />
              <span>Natural Body Balance</span>
            </div>
            <div>
              <h1 className="text-2xl font-medium tracking-tight text-stone-800 sm:text-3xl dark:text-stone-100">
                Weight Journal
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                Follow your long-term body balance with patience and gentle
                consistency across the seasons.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/weight-new"
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
