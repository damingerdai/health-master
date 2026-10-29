'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import {
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon
} from 'lucide-react';

import { changePassword } from '@/components/actions/password';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { FieldSet } from '@/components/ui/field';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp';
import { Alert, AlertDescription } from '../ui/alert';

interface PasswordFormProps {
  twoFactorEnabled: boolean;
}

// Passwords are compared as entered: never trimmed or truncated.
function createPasswordSchema(twoFactorEnabled: boolean) {
  return z
    .object({
      currentPassword: z.string().min(1, 'Enter your current password.'),
      newPassword: z
        .string()
        .min(8, 'Use at least 8 characters for your new password.'),
      confirmPassword: z.string().min(1, 'Re-enter your new password.'),
      twoFactorCode: twoFactorEnabled
        ? z
          .string()
          .regex(
            /^[0-9]{6}$/,
            'Enter the 6-digit code from your authenticator app.'
          )
        : z.string()
    })
    .refine(values => values.newPassword === values.confirmPassword, {
      message: 'Passwords do not match.',
      path: ['confirmPassword']
    });
}

type PasswordFormValues = z.infer<ReturnType<typeof createPasswordSchema>>;

const passwordInputClassName =
  'h-11 rounded-xl border-stone-200/90 bg-[#FAF8F5]/70 pr-10 pl-10 text-sm text-stone-800 transition-colors placeholder:text-stone-400 focus-visible:border-[#3F6254]/50 focus-visible:bg-white focus-visible:ring-[#3F6254]/15 dark:border-stone-800 dark:bg-stone-950/50 dark:text-stone-100 dark:focus-visible:bg-stone-950';

const toggleButtonClassName =
  'absolute top-1/2 right-2 -translate-y-1/2 rounded-lg text-stone-400 hover:bg-stone-200/50 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200';

const otpSlotClassName =
  'size-11 rounded-xl border border-stone-200/90 bg-[#FAF8F5]/80 text-base font-medium text-stone-800 shadow-2xs transition-all first:rounded-l-xl last:rounded-r-xl data-[active=true]:border-[#3F6254]/60 data-[active=true]:bg-white data-[active=true]:ring-3 data-[active=true]:ring-[#3F6254]/15 dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-100 dark:data-[active=true]:border-emerald-500/50 dark:data-[active=true]:bg-stone-950';

export function PasswordForm({ twoFactorEnabled }: PasswordFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(createPasswordSchema(twoFactorEnabled)),
    mode: 'onBlur',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorCode: ''
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: PasswordFormValues) {
    setFormError(null);
    try {
      const result = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        ...(twoFactorEnabled ? { twoFactorCode: values.twoFactorCode } : {})
      });
      if (result.error) {
        if (result.field) {
          form.setError(result.field, {
            type: 'server',
            message: result.error
          });
        } else {
          setFormError(result.error);
        }
        return;
      }
      // End the session and hard-navigate to sign-in with a non-sensitive
      // success indicator. The full page load unloads every client-side
      // field, cache and in-memory state from the old session.
      await signOut({ callbackUrl: '/sign-in?password-updated=1' });
    } catch {
      setFormError(
        'Unable to update your password right now. Please try again.'
      );
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5"
      >
        <CardContent className="flex flex-col gap-4 px-6 sm:px-7">
          {formError && (
            <Alert
              variant="destructive"
              aria-live="polite"
              className="rounded-2xl px-3.5 py-2.5"
            >
              <AlertCircleIcon aria-hidden="true" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <FieldSet disabled={isSubmitting} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs font-medium text-stone-600 dark:text-stone-300">
                      Current password
                    </FormLabel>
                    <Link
                      href="/forget-password"
                      className="rounded-xs text-xs text-stone-500 underline-offset-4 transition-colors hover:text-[#3F6254] hover:underline focus-visible:ring-2 focus-visible:ring-[#3F6254]/30 focus-visible:outline-none dark:text-stone-400 dark:hover:text-emerald-300"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <LockIcon
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400"
                    />
                    <FormControl>
                      <Input
                        type={showCurrentPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Your current password"
                        className={passwordInputClassName}
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          if (formError) setFormError(null);
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={isSubmitting}
                      aria-label={
                        showCurrentPassword
                          ? 'Hide current password'
                          : 'Show current password'
                      }
                      aria-pressed={showCurrentPassword}
                      className={toggleButtonClassName}
                      onClick={() =>
                        setShowCurrentPassword(visible => !visible)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOffIcon aria-hidden="true" className="size-4" />
                      ) : (
                        <EyeIcon aria-hidden="true" className="size-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-xs font-medium text-stone-600 dark:text-stone-300">
                    New password
                  </FormLabel>
                  <div className="relative">
                    <LockIcon
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400"
                    />
                    <FormControl>
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        className={passwordInputClassName}
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          if (form.getValues('confirmPassword')) {
                            void form.trigger('confirmPassword');
                          }
                          if (formError) setFormError(null);
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={isSubmitting}
                      aria-label={
                        showNewPassword
                          ? 'Hide new password'
                          : 'Show new password'
                      }
                      aria-pressed={showNewPassword}
                      className={toggleButtonClassName}
                      onClick={() => setShowNewPassword(visible => !visible)}
                    >
                      {showNewPassword ? (
                        <EyeOffIcon aria-hidden="true" className="size-4" />
                      ) : (
                        <EyeIcon aria-hidden="true" className="size-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-xs font-medium text-stone-600 dark:text-stone-300">
                    Confirm new password
                  </FormLabel>
                  <div className="relative">
                    <LockIcon
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400"
                    />
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Repeat your new password"
                        className={passwordInputClassName}
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          if (formError) setFormError(null);
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={isSubmitting}
                      aria-label={
                        showConfirmPassword
                          ? 'Hide confirmed password'
                          : 'Show confirmed password'
                      }
                      aria-pressed={showConfirmPassword}
                      className={toggleButtonClassName}
                      onClick={() =>
                        setShowConfirmPassword(visible => !visible)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon aria-hidden="true" className="size-4" />
                      ) : (
                        <EyeIcon aria-hidden="true" className="size-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {twoFactorEnabled && (
              <FormField
                control={form.control}
                name="twoFactorCode"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5">
                    <FormLabel className="text-xs font-medium text-stone-600 dark:text-stone-300">
                      Authenticator code
                    </FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        minLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        aria-label="6-digit authenticator code"
                        value={field.value}
                        onChange={value => {
                          field.onChange(value);
                          if (formError) setFormError(null);
                        }}
                        onBlur={field.onBlur}
                      >
                        <InputOTPGroup className="gap-2 sm:gap-2.5">
                          {Array.from({ length: 6 }, (_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className={otpSlotClassName}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            )}
          </FieldSet>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2.5 border-t border-stone-200/60 bg-transparent px-6 pt-5 sm:px-7 dark:border-stone-800/70">
          <Button
            type="submit"
            className="h-10 gap-2 rounded-xl bg-[#3F6254] px-5 text-xs font-medium text-stone-50 hover:bg-[#345246] dark:bg-emerald-700 dark:text-stone-50 dark:hover:bg-emerald-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2Icon
                  aria-hidden="true"
                  className="size-4 animate-spin"
                />
                <span>Updating password...</span>
              </>
            ) : (
              <span>Update password</span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
