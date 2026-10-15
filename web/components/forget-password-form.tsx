'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  Loader2Icon,
  MailIcon,
  SparklesIcon
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
import { forgetPassword } from './actions/forget-password';

const forgetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type ForgetPasswordData = z.infer<typeof forgetPasswordSchema>;

export function ForgetPasswordForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const defaultValues: ForgetPasswordData = {
    email: ''
  };

  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-7', className)}
        {...props}
        noValidate
        onSubmit={form.handleSubmit(async (data: ForgetPasswordData) => {
          setSubmitError(null);
          try {
            await forgetPassword(data.email);
            toast.success('Check your email', {
              description:
                'We have sent a password reset link to your email address.',
              position: 'top-right'
            });
            router.push(
              `/forget-password/success?email=${encodeURIComponent(data.email)}`
            );
          } catch (err) {
            const message =
              (err as Record<'message', string>).message ??
              'Something went wrong';
            setSubmitError(message);
            toast.error(message, {
              position: 'top-right'
            });
          }
        })}
      >
        {/* Warm, Reassuring Header */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/5 px-3 py-1 text-xs font-medium text-[#3F6254] dark:bg-emerald-400/10 dark:text-emerald-300">
            <SparklesIcon className="size-3.5" aria-hidden="true" />
            <span>Gentle Recovery</span>
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-stone-800 sm:text-3xl dark:text-stone-100">
            Forgot your password?
          </h1>
          <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
            No worries at all. Enter your email below and we&apos;ll quietly
            send a reset link to your inbox.
          </p>
        </div>

        {/* Soft Inline Error Feedback */}
        {submitError && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-2.5 rounded-2xl border border-rose-200/80 bg-rose-50/70 px-4 py-3 text-xs leading-relaxed text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
          >
            <AlertCircleIcon
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />
            <span>{submitError}</span>
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
                      placeholder="you@example.com"
                      type="email"
                      autoComplete="email"
                      disabled={isSubmitting}
                      className="h-11 rounded-xl border-stone-200/90 bg-[#FAF8F5]/70 pl-10 text-sm text-stone-800 transition-colors placeholder:text-stone-400 focus-visible:border-[#3F6254]/50 focus-visible:bg-white focus-visible:ring-[#3F6254]/15 dark:border-stone-800 dark:bg-stone-950/50 dark:text-stone-100 dark:focus-visible:bg-stone-950"
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

          <Button
            type="submit"
            size="lg"
            className="h-11 w-full gap-2 rounded-xl bg-[#3F6254] text-sm font-medium text-stone-50 shadow-xs transition-all duration-300 hover:bg-[#345246] dark:bg-emerald-700 dark:text-stone-50 dark:hover:bg-emerald-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2Icon
                  aria-hidden="true"
                  className="size-4 animate-spin"
                />
                <span>Sending reset link...</span>
              </>
            ) : (
              <>
                <span>Send reset link</span>
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
