'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  getTwoFactorSetup,
  updateTwoFactor
} from '@/components/actions/twofactor';
import { TwoFactorSetup } from '@/types/twofactor';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field as BaseField } from '@base-ui/react/field';
import { Fieldset } from '@base-ui/react/fieldset';
import { Skeleton } from '@/components/ui/skeleton';
import { SetupView } from './setup-view';

const Field = BaseField.Root;
const FieldGroup = Fieldset.Root;

export function TwoFactorCard() {
  const router = useRouter();
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [code, setCode] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const result = await getTwoFactorSetup();
      if (result.error) setError(result.error);
      else if (result.data) setSetup(result.data);
    } catch {
      setError('Unable to load two-factor authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    getTwoFactorSetup()
      .then(result => {
        if (!active) return;
        if (result.error) setError(result.error);
        else if (result.data) setSetup(result.data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError('Unable to load two-factor authentication. Please try again.');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!setup || pending || !/^[0-9]{6}$/.test(code)) return;
    setPending(true);
    setError('');
    try {
      const enabled = !setup.enabled;
      const result = await updateTwoFactor(enabled, code);
      if (result.error) {
        setError(result.error);
        return;
      }
      setCode('');
      setDisabling(false);
      setSetup({ enabled });
      toast.success(
        enabled
          ? 'Two-factor authentication enabled'
          : 'Two-factor authentication disabled'
      );
      router.refresh();
      if (!enabled) await load();
    } catch {
      setError('Unable to save changes. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authenticator app</CardTitle>
        <CardDescription>
          Use a time-based verification code when signing in.
        </CardDescription>
        {setup && (
          <Badge variant={setup.enabled ? 'default' : 'secondary'}>
            {setup.enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {loading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          setup && (
            <>
              {!setup.enabled && setup.secret && <SetupView setup={setup} />}
              {setup.enabled && (
                <p>
                  Your account is protected. You will need a code from your
                  authenticator app when signing in.
                </p>
              )}
              {((!setup.enabled && setup.secret) || disabling) && (
                <form
                  id="two-factor-form"
                  onSubmit={submit}
                  className="flex flex-col gap-4"
                >
                  {disabling && (
                    <p>
                      Enter your current authenticator code to confirm turning
                      off this extra protection.
                    </p>
                  )}
                  <FieldGroup
                    disabled={pending}
                    className="flex flex-col gap-4"
                  >
                    <Field
                      data-invalid={!!error}
                      className="flex flex-col gap-2"
                    >
                      <BaseField.Label htmlFor="verification-code">
                        Verification code
                      </BaseField.Label>
                      <Input
                        id="verification-code"
                        value={code}
                        onChange={event => {
                          setCode(
                            event.target.value
                              .replace(/[^0-9]/g, '')
                              .slice(0, 6)
                          );
                          setError('');
                        }}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        required
                        disabled={pending}
                        aria-invalid={!!error}
                        aria-describedby={
                          error ? 'two-factor-error' : undefined
                        }
                      />
                    </Field>
                  </FieldGroup>
                </form>
              )}
            </>
          )
        )}
        {error && (
          <p
            id="two-factor-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {error}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {!loading && (!setup || (!setup.enabled && !setup.secret)) && (
          <Button variant="outline" onClick={load}>
            Retry
          </Button>
        )}
        {!loading &&
          setup &&
          ((!setup.enabled && setup.secret) || disabling) && (
            <Button
              type="submit"
              form="two-factor-form"
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
        {!loading && setup?.enabled && !disabling && (
          <Button
            variant="outline"
            onClick={() => {
              setDisabling(true);
              setError('');
            }}
          >
            Disable two-factor authentication
          </Button>
        )}
        {disabling && (
          <Button
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
    </Card>
  );
}
