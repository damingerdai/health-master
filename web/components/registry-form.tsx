'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  AlertCircleIcon,
  ArrowRightIcon,
  AtSignIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
  SparklesIcon,
  UserIcon
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { request } from '@/lib/request';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const schemas = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .regex(/^[A-Za-z0-9]+$/, 'Only letters and numbers allowed'),
    email: z.string().email('Invalid email address'),
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    gender: z.enum(['M', 'F', 'U']),
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(
        /^(?![0-9]+$)(?![a-zA-Z]+$)/,
        'Must include both letters and numbers'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

type InputData = z.infer<typeof schemas>;

const genderOptions = [
  { val: 'M', label: 'Male' },
  { val: 'F', label: 'Female' },
  { val: 'U', label: 'Other' }
] as const;

const inputClassName =
  'h-10 rounded-xl border-stone-200/90 bg-[#FAF8F5]/70 text-sm text-stone-800 transition-colors placeholder:text-stone-400 focus-visible:border-[#3F6254]/50 focus-visible:bg-white focus-visible:ring-[#3F6254]/15 dark:border-stone-800 dark:bg-stone-950/50 dark:text-stone-100 dark:focus-visible:bg-stone-950';

export function RegistryForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const form = useForm<InputData>({
    resolver: zodResolver(schemas),
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      gender: 'U',
      password: '',
      confirmPassword: ''
    }
  });

  async function onSubmit(data: InputData) {
    setIsLoading(true);
    setRegisterError(null);
    try {
      await request({
        method: 'post',
        url: '/api/user',
        data
      });
      toast.success('Welcome! Account created.');
      router.push('/sign-in');
    } catch (err) {
      const message =
        (err as { message: string }).message || 'Registration failed';
      setRegisterError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6', className)}
        {...props}
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        {/* Warm, Healing Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/5 px-3 py-1 text-xs font-medium text-[#3F6254] dark:bg-emerald-400/10 dark:text-emerald-300">
            <SparklesIcon className="size-3.5" aria-hidden="true" />
            <span>A gentle beginning</span>
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-stone-800 sm:text-3xl dark:text-stone-100">
            Begin your wellness journey
          </h1>
          <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
            Create a peaceful personal space to care for your daily health, one
            mindful check-in at a time.
          </p>
        </div>

        {/* Soft Inline Error Feedback */}
        {registerError && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-2.5 rounded-2xl border border-rose-200/80 bg-rose-50/70 px-4 py-3 text-xs leading-relaxed text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
          >
            <AlertCircleIcon
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />
            <span>{registerError}</span>
          </div>
        )}

        {/* Minimalist, Soft Card Container */}
        <div className="space-y-4 rounded-3xl border border-stone-200/70 bg-white/85 p-6 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm sm:p-7 dark:border-stone-800/80 dark:bg-stone-900/70">
          {/* Username & Email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-medium text-stone-600 dark:text-stone-300">
                    Username
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <AtSignIcon
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400"
                      />
                      <Input
                        autoComplete="username"
                        placeholder="johndoe"
                        disabled={isLoading}
                        className={cn(inputClassName, 'pl-9')}
                        {...field}
                        onChange={e => {
                          if (registerError) setRegisterError(null);
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
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-medium text-stone-600 dark:text-stone-300">
                    Email address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MailIcon
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400"
                      />
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        disabled={isLoading}
                        className={cn(inputClassName, 'pl-9')}
                        {...field}
                        onChange={e => {
                          if (registerError) setRegisterError(null);
                          field.onChange(e);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-medium text-stone-600 dark:text-stone-300">
                    First name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserIcon
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400"
                      />
                      <Input
                        autoComplete="given-name"
                        placeholder="John"
                        disabled={isLoading}
                        className={cn(inputClassName, 'pl-9')}
                        {...field}
                        onChange={e => {
                          if (registerError) setRegisterError(null);
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
              name="lastName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-medium text-stone-600 dark:text-stone-300">
                    Last name
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="family-name"
                      placeholder="Doe"
                      disabled={isLoading}
                      className={inputClassName}
                      {...field}
                      onChange={e => {
                        if (registerError) setRegisterError(null);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium text-stone-600 dark:text-stone-300">
                  Gender
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                    className="grid grid-cols-3 gap-2.5"
                  >
                    {genderOptions.map(item => {
                      const isSelected = field.value === item.val;
                      return (
                        <FormItem key={item.val} className="space-y-0">
                          <FormLabel
                            className={cn(
                              'flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-stone-200/80 bg-[#FAF8F5]/60 px-3 text-xs font-normal text-stone-600 transition-all hover:bg-stone-100/80 dark:border-stone-800 dark:bg-stone-950/40 dark:text-stone-300 dark:hover:bg-stone-800/60',
                              isSelected &&
                                'border-[#3F6254]/50 bg-emerald-900/5 font-medium text-[#3F6254] dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-300'
                            )}
                          >
                            <FormControl>
                              <RadioGroupItem value={item.val} />
                            </FormControl>
                            <span>{item.label}</span>
                          </FormLabel>
                        </FormItem>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Soft Divider for Password Section */}
          <div className="space-y-4 border-t border-stone-200/60 pt-4 dark:border-stone-800/70">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs font-medium text-stone-600 dark:text-stone-300">
                      Password
                    </FormLabel>
                    <span className="text-[11px] text-stone-400">
                      8+ chars with letters &amp; numbers
                    </span>
                  </div>
                  <div className="relative">
                    <LockIcon
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400"
                    />
                    <FormControl>
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Create a calm, secure password"
                        disabled={isLoading}
                        className={cn(inputClassName, 'pr-10 pl-10')}
                        onChange={e => {
                          if (registerError) setRegisterError(null);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={isLoading}
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
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-medium text-stone-600 dark:text-stone-300">
                    Confirm password
                  </FormLabel>
                  <div className="relative">
                    <LockIcon
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400"
                    />
                    <FormControl>
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Repeat your password"
                        disabled={isLoading}
                        className={cn(inputClassName, 'pr-10 pl-10')}
                        onChange={e => {
                          if (registerError) setRegisterError(null);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={isLoading}
                      aria-label={
                        showConfirmPassword
                          ? 'Hide confirm password'
                          : 'Show confirm password'
                      }
                      className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg text-stone-400 hover:bg-stone-200/50 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
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
          </div>

          <Button
            type="submit"
            size="lg"
            className="mt-1 h-11 w-full gap-2 rounded-xl bg-[#3F6254] text-sm font-medium text-stone-50 shadow-xs transition-all duration-300 hover:bg-[#345246] dark:bg-emerald-700 dark:text-stone-50 dark:hover:bg-emerald-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2Icon
                  aria-hidden="true"
                  className="size-4 animate-spin"
                />
                <span>Preparing your space...</span>
              </>
            ) : (
              <>
                <span>Create your space</span>
                <ArrowRightIcon aria-hidden="true" className="size-4" />
              </>
            )}
          </Button>
        </div>

        {/* Gentle Secondary Action */}
        <p className="text-center text-sm text-stone-500 dark:text-stone-400">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="font-medium text-[#3F6254] underline-offset-4 transition-colors hover:underline dark:text-emerald-300"
          >
            Sign in
          </Link>
        </p>
      </form>
    </Form>
  );
}
