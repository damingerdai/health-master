'use client';

import { z } from 'zod';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
  SparklesIcon
} from 'lucide-react';

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

const schemas = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required')
});
type InputData = z.infer<typeof schemas>;

export function LoginForm({
  className,
  passwordUpdated = false,
  ...props
}: React.ComponentProps<'form'> & { passwordUpdated?: boolean }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<InputData>({
    resolver: zodResolver(schemas),
    defaultValues: { email: '', password: '' }
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: InputData) {
    setAuthError(null);
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      });

      if (!res?.ok) {
        const message = res?.error || 'Please check your credentials';
        setAuthError(message);
        toast.error('Login failed', {
          description: message
        });
        return;
      }

      toast.success('Login successful!');
      const session = await getSession();

      if (session?.needTwoFactor) {
        router.push('/2fa');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      const message =
        (err as { message: string }).message || 'Something went wrong';
      setAuthError(message);
      toast.error(message);
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-7', className)}
        {...props}
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        {/* Warm, Relaxing Header */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/5 px-3 py-1 text-xs font-medium text-[#3F6254] dark:bg-emerald-400/10 dark:text-emerald-300">
            <SparklesIcon className="size-3.5" aria-hidden="true" />
            <span>Welcome back</span>
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-stone-800 sm:text-3xl dark:text-stone-100">
            Step into your calm space
          </h1>
          <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
            Take a gentle breath and sign in to continue your personal wellness
            journal.
          </p>
        </div>

        {/* Password Updated Confirmation */}
        {passwordUpdated && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 px-4 py-3 text-xs leading-relaxed text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <CheckCircle2Icon
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />
            <span>Your password has been updated. Please sign in again.</span>
          </div>
        )}

        {/* Soft Inline Error Feedback */}
        {authError && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-2.5 rounded-2xl border border-rose-200/80 bg-rose-50/70 px-4 py-3 text-xs leading-relaxed text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
          >
            <AlertCircleIcon
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />
            <span>{authError}</span>
          </div>
        )}

        {/* Minimalist, Soft Card Container */}
        <div className="space-y-5 rounded-3xl border border-stone-200/70 bg-white/85 p-6 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm sm:p-7 dark:border-stone-800/80 dark:bg-stone-900/70">
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
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      disabled={isSubmitting}
                      className="h-11 rounded-xl border-stone-200/90 bg-[#FAF8F5]/70 pl-10 text-sm text-stone-800 transition-colors placeholder:text-stone-400 focus-visible:border-[#3F6254]/50 focus-visible:bg-white focus-visible:ring-[#3F6254]/15 dark:border-stone-800 dark:bg-stone-950/50 dark:text-stone-100 dark:focus-visible:bg-stone-950"
                      {...field}
                      onChange={e => {
                        if (authError) setAuthError(null);
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
                    Password
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
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Your password"
                      disabled={isSubmitting}
                      className="h-11 rounded-xl border-stone-200/90 bg-[#FAF8F5]/70 pr-10 pl-10 text-sm text-stone-800 transition-colors placeholder:text-stone-400 focus-visible:border-[#3F6254]/50 focus-visible:bg-white focus-visible:ring-[#3F6254]/15 dark:border-stone-800 dark:bg-stone-950/50 dark:text-stone-100 dark:focus-visible:bg-stone-950"
                      {...field}
                      onChange={e => {
                        if (authError) setAuthError(null);
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

          <Button
            type="submit"
            size="lg"
            className="mt-1 h-11 w-full gap-2 rounded-xl bg-[#3F6254] text-sm font-medium text-stone-50 shadow-xs transition-all duration-300 hover:bg-[#345246] dark:bg-emerald-700 dark:text-stone-50 dark:hover:bg-emerald-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2Icon
                  aria-hidden="true"
                  className="size-4 animate-spin"
                />
                <span>Signing in gently...</span>
              </>
            ) : (
              <>
                <span>Enter your space</span>
                <ArrowRightIcon aria-hidden="true" className="size-4" />
              </>
            )}
          </Button>
        </div>

        {/* Gentle Secondary Action */}
        <p className="text-center text-sm text-stone-500 dark:text-stone-400">
          New to Health Master?{' '}
          <Link
            href="/sign-up"
            className="font-medium text-[#3F6254] underline-offset-4 transition-colors hover:underline dark:text-emerald-300"
          >
            Begin your journey
          </Link>
        </p>
      </form>
    </Form>
  );
}
