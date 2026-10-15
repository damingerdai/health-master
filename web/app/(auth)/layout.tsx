import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  Leaf,
  ShieldCheck,
  Sparkles,
  Sun,
  Wind
} from 'lucide-react';

const wellnessCards = [
  {
    title: 'Calm Heart Rhythm',
    reading: '118 / 76 mmHg · 68 bpm',
    note: 'Steady and restful morning reading',
    icon: Heart,
    iconBg:
      'bg-rose-100/80 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300'
  },
  {
    title: 'Natural Body Balance',
    reading: '36.6 °C · 68.4 kg',
    note: 'Gentle consistency across the week',
    icon: Sun,
    iconBg:
      'bg-amber-100/80 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
  },
  {
    title: 'Mindful Continuity',
    reading: '176 cm · Daily Journal',
    note: 'Every small check-in is an act of self-care',
    icon: Wind,
    iconBg:
      'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
  }
];

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-svh bg-[#FAF8F5] text-stone-800 selection:bg-emerald-800/15 selection:text-emerald-950 lg:grid-cols-12 dark:bg-stone-950 dark:text-stone-100">
      {/* Left Column: Minimalist, Warm Auth Sanctuary */}
      <div className="relative flex flex-col justify-between px-6 py-8 sm:px-10 md:px-14 lg:col-span-6 xl:col-span-6">
        {/* Subtle warm ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 -z-10 h-64 w-96 -translate-x-1/2 rounded-full bg-amber-100/40 blur-3xl dark:bg-emerald-950/20"
        />

        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-full py-1 text-sm font-medium tracking-tight text-stone-800 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-emerald-700/30 focus-visible:outline-none dark:text-stone-100"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-[#3F6254] text-stone-50 shadow-2xs transition-transform duration-300 group-hover:scale-105 dark:bg-emerald-800">
              <Leaf className="size-4" />
            </span>
            <span className="text-base font-medium tracking-normal">
              Health Master
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-stone-500 transition-colors hover:bg-stone-200/50 hover:text-stone-800 focus-visible:ring-2 focus-visible:ring-emerald-700/30 focus-visible:outline-none dark:text-stone-400 dark:hover:bg-stone-800/60 dark:hover:text-stone-200"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </Link>
        </header>

        <main className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10">
          {children}
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-2 pt-4 text-xs text-stone-400 dark:text-stone-500">
          <div className="inline-flex items-center gap-1.5">
            <ShieldCheck
              className="size-3.5 text-[#3F6254] dark:text-emerald-400"
              aria-hidden="true"
            />
            <span>Private &amp; encrypted personal wellness journal</span>
          </div>
          <span>© {new Date().getFullYear()} Health Master</span>
        </footer>
      </div>

      {/* Right Column: Warm, Healing & Serene Visual Sanctuary */}
      <aside
        aria-label="Wellness philosophy"
        className="relative hidden flex-col justify-between overflow-hidden rounded-l-[2.5rem] border-l border-stone-200/60 bg-gradient-to-br from-[#F4EFE6] via-[#EDF3EE] to-[#F7F2E9] p-12 lg:col-span-6 lg:flex xl:p-16 dark:border-stone-800/80 dark:from-stone-900 dark:via-emerald-950/25 dark:to-stone-900"
      >
        {/* Soft Organic Breathing Rings & Diffused Light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 size-[28rem] rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-900/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-20 size-[26rem] rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-900/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="size-[34rem] rounded-full border border-stone-400/10 dark:border-stone-700/20" />
          <div className=" -mt-[29rem] ml-[5rem] size-[24rem] rounded-full border border-stone-400/15 dark:border-stone-700/25" />
          <div className="-mt-[19rem] ml-[10rem] size-[14rem] rounded-full border border-stone-400/15 dark:border-stone-700/30" />
        </div>

        {/* Top Pill */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-stone-300/60 bg-white/60 px-3.5 py-1.5 text-xs font-medium text-stone-600 backdrop-blur-md dark:border-stone-700/70 dark:bg-stone-900/60 dark:text-stone-300">
            <Sparkles className="size-3.5 text-amber-600 dark:text-amber-400" />
            <span>Mindful Health Companion</span>
          </span>
        </div>

        {/* Center Editorial Story & Gentle Cards */}
        <div className="relative z-10 my-auto py-8">
          <div className="max-w-md space-y-4">
            <h2 className="text-3xl leading-[1.2] font-normal tracking-tight text-stone-800 xl:text-4xl dark:text-stone-100">
              Listen to your body&apos;s{' '}
              <span className="font-serif text-[#3F6254] italic dark:text-emerald-300">
                quiet rhythm
              </span>
              .
            </h2>
            <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              Health is not a race of numbers, but a gentle daily conversation
              with yourself. Take a slow breath, relax your shoulders, and care
              for your wellbeing at your own pace.
            </p>
          </div>

          <div className="mt-10 space-y-3.5">
            {wellnessCards.map(card => (
              <div
                key={card.title}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/75 px-5 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.03)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5 dark:border-stone-800/80 dark:bg-stone-900/70"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}
                  >
                    <card.icon className="size-4" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-stone-800 dark:text-stone-100">
                      {card.title}
                    </div>
                    <div className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                      {card.note}
                    </div>
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-stone-100/90 px-3 py-1 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                  {card.reading}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="relative z-10 border-t border-stone-300/50 pt-5 dark:border-stone-800">
          <p className="text-xs leading-relaxed text-stone-500 italic dark:text-stone-400">
            &ldquo;Peace of mind begins with paying gentle attention to how you
            feel today.&rdquo;
          </p>
        </div>
      </aside>
    </div>
  );
}
