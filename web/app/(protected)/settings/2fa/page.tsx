import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth-options';
import { TwoFactorCard } from '@/components/two-factor-card';

export default async function TwoFactorPage() {
  const session = await getServerSession(authOptions);
  if (session?.needTwoFactor) redirect('/2fa');
  if (!session?.accessToken) redirect('/sign-in');

  return (
    <div className="container max-w-2xl p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <Link
          href="/profile"
          className="text-sm text-muted-foreground underline"
        >
          Back to profile
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Two-Factor Authentication</h1>
          <p className="text-muted-foreground">
            Protect your account with an additional verification step.
          </p>
        </div>
        <TwoFactorCard />
      </div>
    </div>
  );
}
