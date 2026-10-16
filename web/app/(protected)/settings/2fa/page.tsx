import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, ShieldCheckIcon } from 'lucide-react';
import { authOptions } from '@/lib/auth-options';
import { TwoFactorCard } from '@/components/two-factor-card';
import { getTwoFactorSetup } from '@/components/actions/twofactor';
import { TwoFactorErrorCard } from '@/components/two-factor-card/two-factor-error-card';

export default async function TwoFactorPage() {
  const session = await getServerSession(authOptions);
  if (session?.needTwoFactor) {
    redirect('/2fa');
  }
  if (!session?.accessToken) {
    redirect('/sign-in');
  }

  const twoFactorSetupResult = await getTwoFactorSetup();
  if (twoFactorSetupResult.error) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-10 md:py-14">
        <TwoFactorErrorCard error="Unable to load two-factor authentication. Please try again." />
      </div>
    );
  }
  const twoFactorSetup = twoFactorSetupResult.data!;

  return (
    <div className="relative min-h-[calc(100svh-3rem)] bg-[#FAF8F5]/60 px-6 py-10 md:py-14 dark:bg-transparent">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <div>
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-stone-500 transition-colors hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800/60 dark:hover:text-stone-200"
          >
            <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
            <span>Back to profile</span>
          </Link>
        </div>

        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/5 px-3 py-1 text-xs font-medium text-[#3F6254] dark:bg-emerald-400/10 dark:text-emerald-300">
            <ShieldCheckIcon className="size-3.5" aria-hidden="true" />
            <span>Peace of Mind</span>
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-stone-800 sm:text-3xl dark:text-stone-100">
            Two-Factor Authentication
          </h1>
          <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
            Keep your personal wellness journal quietly protected with an extra
            verification step when signing in.
          </p>
        </div>

        <TwoFactorCard twoFactorSetup={twoFactorSetup} />
      </div>
    </div>
  );
}
