'use client';

import { useState } from 'react';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  Loader2Icon,
  ShieldCheckIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp';
import { isErrorResponse } from '@/types/response';
import { verify2FA } from '@/lib/twofactor';

const slotClassName =
  'size-11 sm:size-12 rounded-xl border border-stone-200/90 bg-[#FAF8F5]/80 text-base font-medium text-stone-800 shadow-2xs transition-all first:rounded-l-xl last:rounded-r-xl data-[active=true]:border-[#3F6254]/60 data-[active=true]:bg-white data-[active=true]:ring-3 data-[active=true]:ring-[#3F6254]/15 dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-100 dark:data-[active=true]:border-emerald-500/50 dark:data-[active=true]:bg-stone-950';

export default function Page() {
  const router = useRouter();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleVerify() {
    if (code.length !== 6) return;

    try {
      setLoading(true);
      setError('');
      const session = await getSession();
      const challengeToken = session?.challengeToken;

      if (!challengeToken) {
        throw new Error('challenge token is required');
      }

      const verify = await verify2FA({
        challengeToken: challengeToken!,
        code
      });
      if (isErrorResponse(verify)) {
        throw new Error(verify.message);
      }

      const result = await signIn('credentials', {
        redirect: false,
        accessToken: verify.data.accessToken
      });

      if (!result?.ok || result.error) {
        throw new Error('Failed to complete sign in');
      }
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Invalid verification code. Please check and try again.');
      setCode('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-7">
      {/* Warm, Reassuring Header */}
      <div className="space-y-2.5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/5 px-3 py-1 text-xs font-medium text-[#3F6254] dark:bg-emerald-400/10 dark:text-emerald-300">
          <ShieldCheckIcon className="size-3.5" aria-hidden="true" />
          <span>Mindful Security</span>
        </div>
        <h1 className="text-2xl font-medium tracking-tight text-stone-800 sm:text-3xl dark:text-stone-100">
          Two-Factor Verification
        </h1>
        <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
          Enter the 6-digit verification code from your authenticator app to
          quietly unlock your personal wellness space.
        </p>
      </div>

      {/* Soft Inline Error Feedback */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-start gap-2.5 rounded-2xl border border-rose-200/80 bg-rose-50/70 px-4 py-3 text-xs leading-relaxed text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
        >
          <AlertCircleIcon
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />
          <span>{error}</span>
        </div>
      )}

      {/* Minimalist, Soft Card Container */}
      <form
        onSubmit={e => {
          e.preventDefault();
          void handleVerify();
        }}
        className="space-y-6 rounded-3xl border border-stone-200/70 bg-white/85 p-6 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm sm:p-7 dark:border-stone-800/80 dark:bg-stone-900/70"
      >
        <div className="space-y-3 text-center">
          <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
            6-digit authenticator code
          </p>

          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              pattern="^[0-9]*$"
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-label="Verification code"
              disabled={loading}
              value={code}
              onChange={value => {
                setCode(value);
                if (error) setError('');
              }}
            >
              <InputOTPGroup className="gap-2 sm:gap-2.5">
                <InputOTPSlot index={0} className={slotClassName} />
                <InputOTPSlot index={1} className={slotClassName} />
                <InputOTPSlot index={2} className={slotClassName} />
                <InputOTPSlot index={3} className={slotClassName} />
                <InputOTPSlot index={4} className={slotClassName} />
                <InputOTPSlot index={5} className={slotClassName} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            Codes refresh every 30 seconds in your authenticator app
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full gap-2 rounded-xl bg-[#3F6254] text-sm font-medium text-stone-50 shadow-xs transition-all duration-300 hover:bg-[#345246] dark:bg-emerald-700 dark:text-stone-50 dark:hover:bg-emerald-600"
          disabled={loading || code.length !== 6}
        >
          {loading ? (
            <>
              <Loader2Icon aria-hidden="true" className="size-4 animate-spin" />
              <span>Verifying gently...</span>
            </>
          ) : (
            <>
              <span>Verify &amp; Continue</span>
              <ArrowRightIcon aria-hidden="true" className="size-4" />
            </>
          )}
        </Button>
      </form>

      {/* Gentle Back Action */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="ghost"
          className="h-9 gap-1.5 rounded-full px-4 text-xs font-medium text-stone-500 hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800/60 dark:hover:text-stone-200"
          onClick={() => router.push('/sign-in')}
        >
          <ArrowLeftIcon aria-hidden="true" className="size-3.5" />
          <span>Back to Sign In</span>
        </Button>
      </div>
    </div>
  );
}
