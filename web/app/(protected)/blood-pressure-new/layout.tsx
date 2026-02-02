import { Button } from '@/components/ui/button';
import { ArrowLeft, HeartPulse } from 'lucide-react';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
   <div className="flex flex-1 flex-col bg-[#f8fafc] dark:bg-zinc-950 min-h-screen">
      <div className="mx-auto w-full max-w-2xl px-4 pt-8 md:px-0">
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
          <Link href="/blood-pressure" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blood Pressure Records</span>
          </Link>
        </Button>
      </div>

      <main className="flex flex-1 items-start justify-center p-4 md:p-10">
        <div className="w-full max-w-xl">
          <div className="mb-8 flex flex-col items-center text-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-900/20 shadow-sm">
              <HeartPulse className="h-7 w-7 text-rose-500" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                New Blood Pressure Record
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your latest blood pressure reading to keep your Master log up to date.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-10 dark:bg-zinc-900 dark:shadow-none">
            <div className="mx-auto max-w-sm">
              {children}
            </div>
            
            <div className="mt-8 border-t pt-6">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-zinc-800/50">
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">💡 Health Tip:</span> For the most accurate result, sit quietly for 5 minutes before taking your measurement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
