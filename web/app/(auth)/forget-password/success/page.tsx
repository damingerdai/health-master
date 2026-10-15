import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  MailCheckIcon,
  SparklesIcon
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const currentSearchParams = await searchParams;
  const email = currentSearchParams.email || 'your email address';

  return (
    <div className="flex flex-col gap-7 animate-in fade-in duration-500">
      {/* Warm Header */}
      <div className="space-y-2.5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/5 px-3 py-1 text-xs font-medium text-[#3F6254] dark:bg-emerald-400/10 dark:text-emerald-300">
          <SparklesIcon className="size-3.5" aria-hidden="true" />
          <span>Letter on its way</span>
        </div>
        <h1 className="text-2xl font-medium tracking-tight text-stone-800 sm:text-3xl dark:text-stone-100">
          Check your inbox
        </h1>
        <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
          We&apos;ve sent a password reset link so you can peacefully restore
          access to your account.
        </p>
      </div>

      {/* Minimalist Ivory Card */}
      <div className="space-y-6 rounded-3xl border border-stone-200/70 bg-white/85 p-6 text-center shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm sm:p-7 dark:border-stone-800/80 dark:bg-stone-900/70">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-900/5 text-[#3F6254] dark:bg-emerald-400/10 dark:text-emerald-300">
          <MailCheckIcon className="size-7" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Reset instructions sent to
          </p>
          <div className="inline-block max-w-full truncate rounded-xl border border-stone-200/80 bg-[#FAF8F5] px-4 py-2 text-sm font-medium text-stone-800 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100">
            {email}
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-11 w-full gap-2 rounded-xl bg-[#3F6254] text-sm font-medium text-stone-50 shadow-xs transition-all duration-300 hover:bg-[#345246] dark:bg-emerald-700 dark:text-stone-50 dark:hover:bg-emerald-600'
            )}
          >
            <span>Open your email</span>
            <ExternalLinkIcon className="size-4" aria-hidden="true" />
          </Link>

          <p className="text-xs leading-relaxed text-stone-400 dark:text-stone-500">
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <Link
              href="/forget-password"
              title="Try again"
              className="font-medium text-[#3F6254] underline-offset-4 hover:underline dark:text-emerald-300"
            >
              try again
            </Link>
          </p>
        </div>
      </div>

      {/* Gentle Back Action */}
      <div className="flex justify-center">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-stone-500 transition-colors hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800/60 dark:hover:text-stone-200"
        >
          <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
