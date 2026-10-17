import * as React from 'react';
import { UserCheck } from 'lucide-react';
import { AppBreadcrumb } from '@/components/app-breadcrumb';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-stone-200/60 bg-white/55 px-6 py-6 backdrop-blur-xs md:px-10 md:py-8 dark:border-stone-800/70 dark:bg-stone-900/35">
        <div className="mx-auto flex max-w-4xl flex-col gap-2.5">
          <AppBreadcrumb subTitle="Profile" />
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-900/5 px-3 py-1 text-xs font-medium text-[#3F6254] dark:bg-emerald-400/10 dark:text-emerald-300">
            <UserCheck className="size-3.5" aria-hidden="true" />
            <span>Personal Sanctuary</span>
          </div>
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-stone-800 sm:text-3xl dark:text-stone-100">
              Profile &amp; Peace of Mind
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
              Manage your personal details and keep your wellness journal
              quietly protected.
            </p>
          </div>
        </div>
      </header>

      <div className="@container/main flex-1">{children}</div>
    </div>
  );
}
