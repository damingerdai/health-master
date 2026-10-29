import { getServerSession } from 'next-auth';
import { AlertCircleIcon } from 'lucide-react';
import { authOptions } from '@/lib/auth-options';
import { getCurrentUser } from '@/components/actions/user';
import { ProfileForm } from '@/components/profile-form';
import { redirect } from 'next/navigation';
import { SecurityCard } from '@/components/security-card';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    redirect('/sign-in');
  }

  const user = await getCurrentUser(session.accessToken);

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-10 md:py-14">
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-rose-200/80 bg-rose-50/70 px-4 py-3 text-xs leading-relaxed text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
        >
          <AlertCircleIcon
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />
          <span>
            We couldn&apos;t load your profile just now. Please refresh the page
            to try again.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative px-6 py-10 md:py-14">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <ProfileForm user={user} />

        <SecurityCard twoFactorEnabled={user.two_factor_enabled} />
      </div>
    </div>
  );
}
