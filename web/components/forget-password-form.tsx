'use client';

import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form';
import { toast } from 'sonner';
import { Loader2Icon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Schema focusing on email validation
const forgetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgetPasswordData = z.infer<typeof forgetPasswordSchema>;

export function ForgetPasswordForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const defaultValues: ForgetPasswordData = {
    email: ''
  };

  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues
  });

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6', className)}
        {...props}
        onSubmit={form.handleSubmit(async (data: ForgetPasswordData) => {
          try {
            // Replace with your actual password reset logic/API call
            // e.g., await api.auth.requestPasswordReset(data.email);

            await new Promise((resolve) => setTimeout(resolve, 1500)); // Mock delay 
            toast.success('Check your email', {
              description: 'We have sent a password reset link to your email address.',
              position: 'top-right'
            });
            router.push(`/forget-password/success?email=${encodeURIComponent(data.email)}`);
          } catch (err) {
            const message = (err as Record<'message', string>).message ?? 'Something went wrong';
            toast.error(message, {
              position: 'top-right'
            });
          }
        })}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Forgot password?</h1>
          <p className="text-muted-foreground text-sm text-balance">
            No worries! Enter your email below and we&apos;ll send you a reset link.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="m@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send reset link
          </Button>
        </div>

        <div className="text-center text-sm">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </form>
    </Form>
  );
}