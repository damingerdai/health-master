'use client';

import { useActionState, useState } from 'react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
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
    <form action={submit} className="flex flex-col gap-4">
      {showForm && (
        <CardContent className="flex flex-col gap-4">
          {disabling && (
            <p>
              Enter your current authenticator code to confirm turning off this
              extra protection.
            </p>
          )}
          <FieldSet disabled={pending} className="flex flex-col gap-4">
            <FormItem data-invalid={!!error} className="flex flex-col gap-2">
              <Label htmlFor="verification-code">Verification code</Label>
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
                <InputOTPGroup>
                  {Array.from({ length: 6 }, (_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      aria-invalid={!!error}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {error && (
                <p
                  id="two-factor-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {error}
                </p>
              )}
            </FormItem>
          </FieldSet>
        </CardContent>
      )}
      <CardFooter className="flex flex-wrap gap-2">
        {showForm && (
          <Button
            type="submit"
            variant={disabling ? 'destructive' : 'default'}
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
