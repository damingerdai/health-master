import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-2 rounded-t-2xl border-b border-stone-200/60 bg-[#FAF8F5]/85 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) dark:border-stone-800/80 dark:bg-stone-950/85">
      <div className="flex w-full items-center gap-2 px-4 lg:px-8">
        <SidebarTrigger className="-ml-1 rounded-xl text-stone-500 transition-colors hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800/60 dark:hover:text-stone-200" />
        <Separator
          orientation="vertical"
          className="mx-1.5 bg-stone-200/80 data-[orientation=vertical]:h-4 dark:bg-stone-800"
        />
        <span className="text-xs font-normal text-stone-500 dark:text-stone-400">
          Listen to your body&apos;s{' '}
          <span className="font-serif text-[#3F6254] italic dark:text-emerald-300">
            quiet rhythm
          </span>
        </span>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/5 px-3 py-1 text-xs font-medium text-[#3F6254] transition-colors hover:bg-emerald-900/10 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-400/15"
          >
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Quietly protected</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
