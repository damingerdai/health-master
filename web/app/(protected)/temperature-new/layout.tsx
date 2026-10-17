import { ArrowLeft, Sparkles, Thermometer } from 'lucide-react';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-1 flex-col px-4 py-8 sm:px-6 md:py-12">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-6">
          <Link
            href="/temperature"
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-stone-500 transition-colors hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800/60 dark:hover:text-stone-200"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            <span>Back to Temperature Journal</span>
          </Link>
        </div>

        <div className="mb-8 flex flex-col items-center space-y-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-100/80 text-amber-700 shadow-2xs ring-1 ring-amber-200/70 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-900/50">
            <Thermometer className="size-6" aria-hidden="true" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/5 px-3 py-1 text-xs font-medium text-[#3F6254] dark:bg-emerald-400/10 dark:text-emerald-300">
            <span>Warmth &amp; Recovery</span>
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-medium tracking-tight text-stone-800 sm:text-3xl dark:text-stone-100">
              Record Body Temperature
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-stone-500 dark:text-stone-400">
              Gently log your latest Celsius reading to stay attentive to your
              body&apos;s natural warmth and rest needs.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200/70 bg-white/85 p-6 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm sm:p-8 md:p-10 dark:border-stone-800/80 dark:bg-stone-900/70">
          <div className="mx-auto max-w-sm">{children}</div>

          <div className="mt-8 border-t border-stone-200/70 pt-6 dark:border-stone-800/80">
            <div className="flex items-start gap-3 rounded-2xl border border-stone-200/60 bg-[#FAF8F5]/80 p-4 dark:border-stone-800/70 dark:bg-stone-950/50">
              <Sparkles
                className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
                aria-hidden="true"
              />
              <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  Mindful Moment:
                </span>{' '}
                Wait 15–20 minutes after enjoying warm tea or outdoor exercise
                before taking your temperature for a steady baseline.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
