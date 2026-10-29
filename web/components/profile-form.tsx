'use client';

import { z } from 'zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AlertCircleIcon, Loader2Icon } from 'lucide-react';

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
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/user';
import { updateProfile } from './actions/profile';
import { useSession } from 'next-auth/react';
import { advancedGravatar } from '@/lib/gravatar';

const profileSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  gender: z.string().min(1, 'Gender is required')
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: User;
  className?: string;
}

const inputClassName =
  'h-11 rounded-xl border-stone-200/90 bg-[#FAF8F5]/70 px-3.5 text-sm text-stone-800 transition-colors placeholder:text-stone-400 focus-visible:border-[#3F6254]/50 focus-visible:bg-white focus-visible:ring-[#3F6254]/15 dark:border-stone-800 dark:bg-stone-950/50 dark:text-stone-100 dark:focus-visible:bg-stone-950';

const labelClassName = 'text-xs font-medium text-stone-600 dark:text-stone-300';

export function ProfileForm({ user, className }: ProfileFormProps) {
  const { data: session, update } = useSession();
  const [formError, setFormError] = useState<string | null>(null);

  const avatar = useMemo(() => {
    if (!user) {
      return '/avatars/shadcn.jpg';
    }
    if (user.email) {
      return advancedGravatar(user.email);
    }

    return '/avatars/shadcn.jpg';
  }, [user]);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user.username || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      gender: user.gender || ''
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  // Clear the inline error banner as soon as the user resumes typing.
  const clearFormError = () => {
    if (formError) setFormError(null);
  };

  async function onSubmit(data: ProfileFormValues) {
    setFormError(null);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const result = await updateProfile({}, formData);
      if (result.success) {
        toast.success(result.message);
        if (session) {
          await update({
            ...session,
            user: {
              ...session.user,
              username: formData.get('username') as string,
              firstName: formData.get('firstName') as string,
              lastName: formData.get('lastName') as string,
              email: formData.get('email') as string,
              gender: formData.get('gender') as string
            }
          });
        }
      } else {
        setFormError(
          result.message ?? 'Something went wrong. Please try again.'
        );
      }
    } catch (error) {
      console.error(error);
      setFormError('Something went wrong. Please try again.');
    }
  }

  return (
    <Card
      className={cn(
        'rounded-3xl border-stone-200/70 bg-white/85 py-6 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm sm:py-7 dark:border-stone-800/80 dark:bg-stone-900/70',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center gap-4 border-b border-stone-200/60 px-6 pb-5 sm:px-7 dark:border-stone-800/70">
        <Avatar className="size-16 border border-stone-200/70 ring-4 ring-emerald-900/5 dark:border-stone-800 dark:ring-emerald-400/10">
          <AvatarImage src={avatar} alt={user.username} />
          <AvatarFallback className="bg-[#FAF8F5] text-base font-medium text-stone-600 dark:bg-stone-900 dark:text-stone-300">
            {user.firstName[0]}
            {user.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="text-lg font-medium text-stone-800 dark:text-stone-100">
            Personal details
          </CardTitle>
          <CardDescription className="text-xs text-stone-500 dark:text-stone-400">
            Keep your name and contact details up to date.
          </CardDescription>
        </div>
      </CardHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5"
        >
          <CardContent className="flex flex-col gap-4 px-6 pt-5 sm:px-7">
            {formError && (
              <div
                role="alert"
                aria-live="polite"
                className="flex items-start gap-2 rounded-2xl border border-rose-200/80 bg-rose-50/70 px-3.5 py-2.5 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
              >
                <AlertCircleIcon
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0"
                />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5">
                    <FormLabel className={labelClassName}>Username</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="username"
                        placeholder="johndoe"
                        className={inputClassName}
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          clearFormError();
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5">
                    <FormLabel className={labelClassName}>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="john@example.com"
                        className={inputClassName}
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5">
                    <FormLabel className={labelClassName}>First name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="given-name"
                        placeholder="John"
                        className={inputClassName}
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          clearFormError();
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5">
                    <FormLabel className={labelClassName}>Last name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="family-name"
                        placeholder="Doe"
                        className={inputClassName}
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          clearFormError();
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5">
                    <FormLabel className={labelClassName}>Gender</FormLabel>
                    <Select
                      items={[
                        { value: 'M', label: 'Male' },
                        { value: 'F', label: 'Female' },
                        { value: 'O', label: 'Other' }
                      ]}
                      onValueChange={value => {
                        field.onChange(value);
                        clearFormError();
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full rounded-xl border-stone-200/90 bg-[#FAF8F5]/70 px-3.5 text-sm text-stone-800 transition-colors focus-visible:border-[#3F6254]/50 focus-visible:bg-white focus-visible:ring-[#3F6254]/15 data-placeholder:text-stone-400 dark:border-stone-800 dark:bg-stone-950/50 dark:text-stone-100 dark:focus-visible:bg-stone-950">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
                          <SelectItem value="O">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-wrap gap-2.5 border-t border-stone-200/60 bg-transparent px-6 pt-5 sm:px-7 dark:border-stone-800/70">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 gap-2 rounded-xl bg-[#3F6254] px-5 text-xs font-medium text-stone-50 hover:bg-[#345246] dark:bg-emerald-700 dark:text-stone-50 dark:hover:bg-emerald-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon
                    aria-hidden="true"
                    className="size-4 animate-spin"
                  />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save changes</span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
