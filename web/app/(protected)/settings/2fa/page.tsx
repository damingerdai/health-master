import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
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
      <TwoFactorErrorCard error="Unable to load two-factor authentication. Please try again." />
    );
  }
  const twoFactorSetup = twoFactorSetupResult.data!;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
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
        <TwoFactorCard twoFactorSetup={twoFactorSetup} />
      </div>
    </div>
  );
}
