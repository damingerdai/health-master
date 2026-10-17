import * as React from 'react';
import { Sparkles } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-stone-200/60 bg-white/50 px-6 py-6 backdrop-blur-xs md:px-10 md:py-8 dark:border-stone-800/70 dark:bg-stone-900/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-2">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-900/5 px-3 py-1 text-xs font-medium text-[#3F6254] dark:bg-emerald-400/10 dark:text-emerald-300">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span>Daily Wellness Overview</span>
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-stone-800 sm:text-3xl dark:text-stone-100">
            Your body&apos;s{' '}
            <span className="font-serif text-[#3F6254] italic dark:text-emerald-300">
              gentle harmony
            </span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-stone-500 dark:text-stone-400">
            Observe your vital trends at an unhurried pace. Every check-in helps
            you stay connected to how you feel today.
          </p>
        </div>
      </header>

      <div className="@container/main mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 md:px-10 md:py-8">
        {children}
      </div>
    </div>
  );
}
