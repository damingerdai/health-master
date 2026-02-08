'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
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
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { request } from '@/lib/request';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const schemas = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .regex(/^[A-Za-z0-9]+$/, 'Only letters and numbers allowed'),
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    gender: z.enum(['M', 'F', 'U']),
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/^(?![0-9]+$)(?![a-zA-Z]+$)/, 'Must include both letters and numbers'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

type InputData = z.infer<typeof schemas>;

export function RegistryForm({ className, ...props }: React.ComponentProps<'form'>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<InputData>({
    resolver: zodResolver(schemas),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      gender: 'U',
      password: '',
      confirmPassword: ''
    }
  });

  async function onSubmit(data: InputData) {
    setIsLoading(true);
    try {
      await request({
        method: 'post',
        url: '/api/user',
        data
      });
      toast.success('Welcome! Account created.');
      router.push('/sign-in');
    } catch (err) {
      toast.error((err as { message: string}).message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-5', className)}
        {...props}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="text-muted-foreground text-sm">Enter your details to get started</p>
        </div>

        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl><Input placeholder="johndoe" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl><Input placeholder="John" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    {[
                      { val: 'M', label: 'Male' },
                      { val: 'F', label: 'Female' },
                      { val: 'U', label: 'Other' }
                    ].map(item => (
                      <FormItem key={item.val} className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value={item.val} /></FormControl>
                        <FormLabel className="font-normal cursor-pointer">{item.label}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input {...field} type={showPassword ? 'text' : 'password'} className="pr-10" />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Creating account...' : 'Sign up'}
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-primary hover:underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
}