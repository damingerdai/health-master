import * as React from 'react';
import { AppBreadcrumb } from '@/components/app-breadcrumb';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';
import { PlusIcon } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-slate-50/50 dark:bg-zinc-950">
      <header className="sticky top-0 z-10 flex w-full items-center justify-between border-b bg-white/80 backdrop-blur-md px-4 py-4 md:px-8 dark:bg-zinc-900/80">
        <div className="flex flex-col gap-1">
          <AppBreadcrumb subTitle="Blood Pressure" />
          <p className="text-xs text-muted-foreground hidden md:block">
            Track and manage your blood pressure levels daily.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="shadow-sm">
            <Link href="/blood-pressure-new" className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              <span>New Record</span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="@container/main flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             {/* 占位：后续可以传入快捷统计组件 */}
          </section>

          <div className="relative min-h-[400px] rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-1 md:p-2">
                 {children}
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}
