import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft, Ruler } from 'lucide-react';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-[#f8fafc] dark:bg-zinc-950 min-h-screen">
      <div className="mx-auto w-full max-w-2xl px-4 pt-8 md:px-0">
        <Link
          href="/height"
          className={buttonVariants({
            variant: 'ghost',
            size: 'sm',
            className: [
              '-ml-2 text-muted-foreground hover:text-foreground',
              'flex items-center gap-2'
            ].join(' ')
          })}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Height Records</span>
        </Link>
      </div>

      <main className="flex flex-1 items-start justify-center p-4 md:p-10">
        <div className="w-full max-w-xl">
          <div className="mb-8 flex flex-col items-center text-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20 shadow-sm">
              <Ruler className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Log Height
              </h1>
              <p className="text-sm text-muted-foreground">
                Record your height measurements to track your growth over time.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-10 dark:bg-zinc-900 dark:shadow-none">
            <div className="mx-auto max-w-sm">{children}</div>

            <div className="mt-8 border-t pt-6">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-zinc-800/50">
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    💡 Health Tip:
                  </span>{' '}
                  For consistent measurements, stand straight with your shoulders back and measure at the same time of day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}