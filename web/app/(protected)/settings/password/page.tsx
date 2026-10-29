import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, KeyRoundIcon } from 'lucide-react';
import { authOptions } from '@/lib/auth-options';
import { PasswordCard } from '@/components/password-card';
import { PasswordErrorCard } from '@/components/password-card/password-error-card';
import { getTwoFactorSetup } from '@/components/actions/twofactor';

export default async function PasswordPage() {
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
        <PasswordErrorCard error="Unable to load your security settings. Please try again." />
      </div>
    );
  }
  const twoFactorEnabled = twoFactorSetupResult.data!.enabled;

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
            <KeyRoundIcon className="size-3.5" aria-hidden="true" />
            <span>Account Security</span>
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-stone-800 sm:text-3xl dark:text-stone-100">
            Password
          </h1>
          <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
            Refresh the password that quietly guards your personal wellness
            journal.
          </p>
        </div>

        <PasswordCard twoFactorEnabled={twoFactorEnabled} />
      </div>
    </div>
  );
}
