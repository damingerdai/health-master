'use client';

import { useState } from 'react';
import { z } from 'zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  KeyRoundIcon,
  Loader2Icon,
  LockIcon,
  MailIcon
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form';
import { resetPassword } from './actions/reset-password';

const resetPasswordSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

const inputClassName =
  'h-11 rounded-xl border-stone-200/90 bg-[#FAF8F5]/70 text-sm text-stone-800 transition-colors placeholder:text-stone-400 focus-visible:border-[#3F6254]/50 focus-visible:bg-white focus-visible:ring-[#3F6254]/15 dark:border-stone-800 dark:bg-stone-950/50 dark:text-stone-100 dark:focus-visible:bg-stone-950';

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract token from URL: reset-password?token=...
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: ResetPasswordData) => {
    setSubmitError(null);
    if (!token) {
      const msg = 'Reset token is missing. Please request a new link.';
      setSubmitError(msg);
      toast.error('Invalid request', {
        description: msg
      });
      return;
    }

    try {
      await resetPassword({
        token,
        email: data.email,
        password: data.password
      });

      toast.success('Password updated', {
        description:
          'Your password has been reset successfully. Please log in.',
        position: 'top-right'
      });

      router.push('/sign-in');
    } catch (err) {
      const message =
        (err as Record<'message', string>).message ?? 'Something went wrong';
      setSubmitError(message);
      toast.error(message, {
        position: 'top-right'
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-7', className)}
        {...props}
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Warm, Reassuring Header */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/5 px-3 py-1 text-xs font-medium text-[#3F6254] dark:bg-emerald-400/10 dark:text-emerald-300">
            <KeyRoundIcon className="size-3.5" aria-hidden="true" />
            <span>Fresh Start</span>
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-stone-800 sm:text-3xl dark:text-stone-100">
            Reset your password
          </h1>
          <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
            Enter your email and choose a new password to peacefully secure your
            wellness space.
          </p>
        </div>

        {/* Soft Inline Error or Missing Token Notice */}
        {(submitError || !token) && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-2.5 rounded-2xl border border-rose-200/80 bg-rose-50/70 px-4 py-3 text-xs leading-relaxed text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
          >
            <AlertCircleIcon
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />
            <span>
              {submitError ||
                'Reset token is missing from the link. Please request a new password reset email.'}
            </span>
          </div>
        )}

        {/* Minimalist Ivory Card */}
        <div className="space-y-4 rounded-3xl border border-stone-200/70 bg-white/85 p-6 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm sm:p-7 dark:border-stone-800/80 dark:bg-stone-900/70">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs font-medium text-stone-600 dark:text-stone-300">
                  Email address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <MailIcon
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400"
                    />
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      autoComplete="email"
                      disabled={isSubmitting}
                      className={cn(inputClassName, 'pl-10')}
                      {...field}
                      onChange={e => {
                        if (submitError) setSubmitError(null);
                        field.onChange(e);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-medium text-stone-600 dark:text-stone-300">
                    New password
                  </FormLabel>
                  <span className="text-[11px] text-stone-400">
                    At least 8 characters
                  </span>
                </div>
                <div className="relative">
                  <LockIcon
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400"
                  />
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Create a new password"
                      disabled={isSubmitting}
                      className={cn(inputClassName, 'pr-10 pl-10')}
                      {...field}
                      onChange={e => {
                        if (submitError) setSubmitError(null);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={isSubmitting}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg text-stone-400 hover:bg-stone-200/50 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                    onClick={() => setShowPassword(visible => !visible)}
                  >
                    {showPassword ? (
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
              <FormItem className="space-y-2">
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
                      disabled={isSubmitting}
                      className={cn(inputClassName, 'pr-10 pl-10')}
                      {...field}
                      onChange={e => {
                        if (submitError) setSubmitError(null);
                        field.onChange(e);
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
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg text-stone-400 hover:bg-stone-200/50 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                    onClick={() => setShowConfirmPassword(visible => !visible)}
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

          <Button
            type="submit"
            size="lg"
            className="mt-1 h-11 w-full gap-2 rounded-xl bg-[#3F6254] text-sm font-medium text-stone-50 shadow-xs transition-all duration-300 hover:bg-[#345246] dark:bg-emerald-700 dark:text-stone-50 dark:hover:bg-emerald-600"
            disabled={isSubmitting || !token}
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
              <>
                <span>Reset Password</span>
                <ArrowRightIcon aria-hidden="true" className="size-4" />
              </>
            )}
          </Button>
        </div>

        {/* Gentle Back Action */}
        <div className="flex justify-center">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-stone-500 transition-colors hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800/60 dark:hover:text-stone-200"
          >
            <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </form>
    </Form>
  );
}
