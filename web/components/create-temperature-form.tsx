'use client';

import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import {
  AlertCircleIcon,
  Calendar as CalendarIcon,
  Clock,
  Loader2,
  Save,
  Thermometer,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { request } from '@/lib/request';

const schemas = z
  .object({
    temperature: z.coerce.number<string>().min(30).max(113),
    unit: z.enum(['C', 'F']),
    note: z.string().max(500).optional(),
    logDate: z.date({
      error: 'Log date is required'
    }),
    logTime: z.string().optional()
  })
  .refine(
    data => {
      if (data.unit === 'C') {
        return data.temperature >= 30 && data.temperature <= 45;
      } else if (data.unit === 'F') {
        return data.temperature >= 86 && data.temperature <= 113;
      }
      return false;
    },
    {
      message:
        'Temperature must be between 30-45°C or 86-113°F depending on the unit',
      path: ['temperature']
    }
  );

type InputData = z.infer<typeof schemas>;

const inputClassName =
  'h-11 rounded-xl border-stone-200/90 bg-[#FAF8F5]/70 pr-12 text-base font-medium text-stone-800 transition-colors placeholder:text-stone-400 focus-visible:border-[#3F6254]/50 focus-visible:bg-white focus-visible:ring-[#3F6254]/15 dark:border-stone-800 dark:bg-stone-950/50 dark:text-stone-100 dark:focus-visible:bg-stone-950';

const labelClassName = 'text-xs font-medium text-stone-600 dark:text-stone-300';

const unitClassName =
  'pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-400 dark:text-stone-500';

export function CreateTemperatureForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [isPending, startTransition] = React.useTransition();
  const [formError, setFormError] = React.useState<string | null>(null);
  const router = useRouter();
  const currentDate = new Date();
  const defaultValues: z.input<typeof schemas> = {
    temperature: '36.5',
    unit: 'C',
    logDate: currentDate,
    logTime: format(currentDate, 'HH:mm'),
    note: ''
  };

  const form = useForm({
    resolver: zodResolver(schemas),
    defaultValues
  });

  const unit = useWatch({ control: form.control, name: 'unit' });

  // Clear the inline error banner as soon as the user resumes typing.
  const clearFormError = () => {
    if (formError) setFormError(null);
  };

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6', className)}
        {...props}
        onSubmit={form.handleSubmit(async (data: InputData) => {
          setFormError(null);
          startTransition(async () => {
            const logTime = data.logTime ?? format(new Date(), 'HH:mm');
            const [hours, minutes] = logTime.split(':').map(Number);
            const recordDate = new Date(data.logDate);
            recordDate.setHours(hours, minutes, 0, 0);

            const value = {
              temperature: data.temperature,
              unit: data.unit,
              note: data.note,
              recordDate
            };

            try {
              await request({
                method: 'POST',
                url: '/api/user-temperature',
                data: value
              });
              toast.success('Temperature record created successfully');
              router.push('/temperature');
            } catch (err) {
              console.error('Error creating temperature record:', err);
              setFormError(
                typeof err === 'object' && err !== null && 'message' in err
                  ? ((err as { message?: string }).message ??
                      'Failed to create temperature record')
                  : 'Failed to create temperature record'
              );
            }
          });
        })}
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
              <Thermometer
                className="size-4 text-amber-600/80 dark:text-amber-400/80"
                aria-hidden="true"
              />
              <span>Temperature reading</span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5">
                    <FormLabel className={labelClassName}>
                      Temperature
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          inputMode="decimal"
                          className={inputClassName}
                          {...field}
                          onChange={e => {
                            field.onChange(e);
                            clearFormError();
                          }}
                        />
                      </FormControl>
                      <span className={unitClassName}>°{unit}</span>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5">
                    <FormLabel className={labelClassName}>Unit</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={value => {
                          field.onChange(value);
                          clearFormError();
                        }}
                        defaultValue={field.value}
                        className="flex h-11 items-center gap-4 rounded-xl border border-stone-200/90 bg-[#FAF8F5]/70 px-3.5 dark:border-stone-800 dark:bg-stone-950/50"
                      >
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="C" />
                          </FormControl>
                          <FormLabel className="cursor-pointer text-sm font-medium text-stone-700 dark:text-stone-300">
                            Celsius (°C)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="F" />
                          </FormControl>
                          <FormLabel className="cursor-pointer text-sm font-medium text-stone-700 dark:text-stone-300">
                            Fahrenheit (°F)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-stone-200/60 pt-6 dark:border-stone-800/70">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
              <MessageSquare
                className="size-4 text-amber-600/80 dark:text-amber-400/80"
                aria-hidden="true"
              />
              <span>Notes (optional)</span>
            </div>
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormControl>
                    <Textarea
                      placeholder="Feeling sick, after exercise, etc."
                      className="min-h-[100px] resize-none rounded-xl border-stone-200/90 bg-[#FAF8F5]/70 px-3.5 py-3 text-sm text-stone-800 transition-colors placeholder:text-stone-400 focus-visible:border-[#3F6254]/50 focus-visible:bg-white focus-visible:ring-[#3F6254]/15 dark:border-stone-800 dark:bg-stone-950/50 dark:text-stone-100 dark:focus-visible:bg-stone-950"
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
