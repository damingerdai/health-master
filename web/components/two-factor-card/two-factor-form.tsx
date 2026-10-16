'use client';

import { useActionState, useState } from 'react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { AlertCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { updateTwoFactor } from '@/components/actions/twofactor';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp';
import { FieldSet } from '@/components/ui/field';

interface TwoFactorFormProps {
  enabled: boolean;
  canEnable: boolean;
}

const slotClassName =
  'size-11 rounded-xl border border-stone-200/90 bg-[#FAF8F5]/80 text-base font-medium text-stone-800 shadow-2xs transition-all first:rounded-l-xl last:rounded-r-xl data-[active=true]:border-[#3F6254]/60 data-[active=true]:bg-white data-[active=true]:ring-3 data-[active=true]:ring-[#3F6254]/15 dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-100 dark:data-[active=true]:border-emerald-500/50 dark:data-[active=true]:bg-stone-950';

export function TwoFactorForm({ enabled, canEnable }: TwoFactorFormProps) {
  const [disabling, setDisabling] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [, submit, pending] = useActionState(
    async (_: null, formData: FormData) => {
      setError('');
      try {
        const result = await updateTwoFactor(
          !enabled,
          String(formData.get('code') ?? '')
        );
        if (result.error) {
          setError(result.error);
          return null;
        }
        setCode('');
        setDisabling(false);
        toast.success(
          enabled
            ? 'Two-factor authentication disabled'
            : 'Two-factor authentication enabled'
        );
      } catch {
        setError('Unable to save changes. Please try again.');
      }
      return null;
    },
    null
  );

  const showForm = (!enabled && canEnable) || disabling;

  return (
    <form action={submit} className="flex flex-col gap-5">
      {showForm && (
        <CardContent className="flex flex-col gap-4 px-6 sm:px-7">
          {disabling && (
            <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              Enter your current authenticator code to confirm turning off this
              extra protection.
            </p>
          )}
          <FieldSet disabled={pending} className="flex flex-col gap-4">
            <FormItem data-invalid={!!error} className="flex flex-col gap-2.5">
              <Label
                htmlFor="verification-code"
                className="text-xs font-medium text-stone-600 dark:text-stone-300"
              >
                Verification code
              </Label>
              <InputOTP
                id="verification-code"
                name="code"
                value={code}
                onChange={value => {
                  setCode(value.replace(/[^0-9]/g, '').slice(0, 6));
                  setError('');
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern={REGEXP_ONLY_DIGITS}
                minLength={6}
                maxLength={6}
                aria-label="6-digit verification code"
                required
                disabled={pending}
                aria-invalid={!!error}
                aria-describedby={error ? 'two-factor-error' : undefined}
              >
                <InputOTPGroup className="gap-2 sm:gap-2.5">
                  {Array.from({ length: 6 }, (_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      aria-invalid={!!error}
                      className={slotClassName}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {error && (
                <div
                  id="two-factor-error"
                  role="alert"
                  className="flex items-start gap-2 rounded-2xl border border-rose-200/80 bg-rose-50/70 px-3.5 py-2.5 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                >
                  <AlertCircleIcon
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0"
                  />
                  <span>{error}</span>
                </div>
              )}
            </FormItem>
          </FieldSet>
        </CardContent>
      )}
      <CardFooter className="flex flex-wrap gap-2.5 border-t border-stone-200/60 bg-transparent px-6 pt-5 sm:px-7 dark:border-stone-800/70">
        {showForm && (
          <Button
            type="submit"
            variant={disabling ? 'destructive' : 'default'}
            className={
              disabling
                ? 'h-10 rounded-xl px-5 text-xs font-medium'
                : 'h-10 rounded-xl bg-[#3F6254] px-5 text-xs font-medium text-stone-50 hover:bg-[#345246] dark:bg-emerald-700 dark:text-stone-50 dark:hover:bg-emerald-600'
            }
            disabled={pending || code.length !== 6}
          >
            {pending
              ? 'Saving...'
              : disabling
                ? 'Confirm disable'
                : 'Enable two-factor authentication'}
          </Button>
        )}
        {enabled && !disabling && (
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl border-stone-200 bg-white px-5 text-xs font-medium text-stone-700 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200"
            disabled={pending}
            onClick={() => setDisabling(true)}
          >
            Disable two-factor authentication
          </Button>
        )}
        {disabling && (
          <Button
            type="button"
            variant="ghost"
            className="h-10 rounded-xl px-4 text-xs font-medium text-stone-500 hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400"
            disabled={pending}
            onClick={() => {
              setDisabling(false);
              setCode('');
              setError('');
            }}
          >
            Cancel
          </Button>
        )}
      </CardFooter>
    </form>
  );
}
