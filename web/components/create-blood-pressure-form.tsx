'use client';

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Activity,
  AlertCircleIcon,
  Calendar as CalendarIcon,
  Clock,
  Heart,
  Loader2,
  Save
} from 'lucide-react';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { createUserBloodPressure } from '@/components/actions/user-blood-pressure';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import * as React from 'react';

const readingSchema = z
  .string()
  .trim()
  .min(1, 'Reading is required')
  .pipe(
    z.coerce.number<string>().int('Enter a whole number').min(0).max(2147483647)
  );

const schemas = z.object({
  systolic: readingSchema,
  diastolic: readingSchema,
  pulse: readingSchema,
  logDate: z.date({
    error: 'Log date is required'
  }),
  logTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Enter a valid time')
});

const inputClassName =
  'h-11 rounded-xl border-stone-200/90 bg-[#FAF8F5]/70 pr-12 text-base font-medium text-stone-800 transition-colors placeholder:text-stone-400 focus-visible:border-[#3F6254]/50 focus-visible:bg-white focus-visible:ring-[#3F6254]/15 dark:border-stone-800 dark:bg-stone-950/50 dark:text-stone-100 dark:focus-visible:bg-stone-950';

const labelClassName = 'text-xs font-medium text-stone-600 dark:text-stone-300';

const unitClassName =
  'pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-stone-400 dark:text-stone-500';

export function CreateBloodPressureForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [formError, setFormError] = useState<string | null>(null);

  const defaultValues: z.input<typeof schemas> = {
    systolic: '120',
    diastolic: '80',
    pulse: '70',
    logDate: new Date(),
    logTime: format(new Date(), 'HH:mm') // Default to current time
  };

  const form = useForm({ resolver: zodResolver(schemas), defaultValues });
  const router = useRouter();
  const [, submitAction, isPending] = useActionState(
    async (_: null, formData: FormData) => {
      setFormError(null);
      await form.handleSubmit(async data => {
        const [hours, minutes] = data.logTime.split(':').map(Number);
        const logDate = new Date(data.logDate);
        logDate.setHours(hours, minutes, 0, 0);
        formData.set('systolic', String(data.systolic));
        formData.set('diastolic', String(data.diastolic));
        formData.set('pulse', String(data.pulse));
        formData.set('logDatetime', logDate.toISOString());

        try {
          const result = await createUserBloodPressure(formData);
          if ('error' in result) {
            setFormError(result.error);
            return;
          }
          toast.success('Blood pressure record created successfully');
          router.push('/blood-pressure');
        } catch {
          setFormError('Unable to save the record. Please try again.');
        }
      })();
      return null;
    },
    null
  );

  // Clear the inline error banner as soon as the user resumes typing.
  const clearFormError = () => {
    if (formError) setFormError(null);
  };

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6', className)}
        {...props}
        action={submitAction}
      >
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

        <div className="grid gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
              <Activity
                className="size-4 text-rose-500/80 dark:text-rose-400/80"
                aria-hidden="true"
              />
              <span>Blood pressure readings</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="systolic"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5">
                    <FormLabel className={labelClassName}>Systolic</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          className={inputClassName}
                          {...field}
                          onChange={e => {
                            field.onChange(e);
                            clearFormError();
                          }}
                        />
                      </FormControl>
                      <span className={unitClassName}>mmHg</span>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diastolic"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5">
                    <FormLabel className={labelClassName}>Diastolic</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          className={inputClassName}
                          {...field}
                          onChange={e => {
                            field.onChange(e);
                            clearFormError();
                          }}
                        />
                      </FormControl>
                      <span className={unitClassName}>mmHg</span>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
              <Heart
                className="size-4 text-rose-500/80 dark:text-rose-400/80"
                aria-hidden="true"
              />
              <span>Heart rate</span>
            </div>
            <FormField
              control={form.control}
              name="pulse"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        className={inputClassName}
                        placeholder="70"
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          clearFormError();
                        }}
                      />
                    </FormControl>
                    <span className={unitClassName}>BPM</span>
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-stone-200/60 pt-6 dark:border-stone-800/70">
            <FormField
              control={form.control}
              name="logDate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className={labelClassName}>Date</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              'h-11 w-full rounded-xl border-stone-200/90 bg-[#FAF8F5]/70 pl-3.5 text-left text-sm font-normal text-stone-800 transition-colors hover:bg-stone-100/60 focus-visible:border-[#3F6254]/50 focus-visible:ring-[#3F6254]/15 dark:border-stone-800 dark:bg-stone-950/50 dark:text-stone-100 dark:hover:bg-stone-900',
                              !field.value && 'text-stone-400'
                            )}
                          />
                        }
                      >
                        {field.value ? (
                          format(field.value, 'MMM dd')
                        ) : (
                          <span>Pick date</span>
                        )}
                        <CalendarIcon
                          className="ml-auto size-4 text-stone-400"
                          aria-hidden="true"
                        />
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={value => {
                          field.onChange(value);
                          clearFormError();
                        }}
                        disabled={date =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logTime"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className={labelClassName}>Time</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="time"
                        className={cn(inputClassName, 'pr-10 pl-3.5')}
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          clearFormError();
                        }}
                      />
                      <Clock
                        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400"
                        aria-hidden="true"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="h-11 w-full gap-2 rounded-xl bg-[#3F6254] text-sm font-medium text-stone-50 shadow-xs transition-all duration-300 hover:bg-[#345246] dark:bg-emerald-700 dark:text-stone-50 dark:hover:bg-emerald-600"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                <span>Saving gently...</span>
              </>
            ) : (
              <>
                <Save className="size-4" aria-hidden="true" />
                <span>Save record</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
