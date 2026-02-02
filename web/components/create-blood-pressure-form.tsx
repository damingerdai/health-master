'use client';

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Activity, Calendar as CalendarIcon, Clock, Heart, Loader2, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { request } from '@/lib/request';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import * as React from 'react';

const schemas = z.object({
  systolic: z.coerce.number().min(0, 'Systolic is required'),
  diastolic: z.coerce.number().min(0, 'Diastolic is required'),
  pulse: z.coerce.number().min(0, 'Pulse is required'),
  logDate: z.date({
    required_error: 'Log date is required'
  }),
  logTime: z.string().optional()
});

type InputData = z.infer<typeof schemas>;

export function CreateBloodPressureForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [isPending, startTransition] = React.useTransition();
  const defaultValues: InputData = {
    systolic: 120,
    diastolic: 80,
    pulse: 70,
    logDate: new Date(),
    logTime: format(new Date(), 'HH:mm') // Default to current time
  };
  const form = useForm({ resolver: zodResolver(schemas), defaultValues });
  const router = useRouter();

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6', className)}
        {...props}
        onSubmit={form.handleSubmit(async (data: InputData) => {
          startTransition(async () => {
            const logTime = data.logTime ?? format(new Date(), 'HH:mm'); // Use provided time or default to current time
            // Parse the logTime to set hours and minutes
            // Assuming logTime is in "HH:mm" format
            const [hours, minutes] = logTime.split(':').map(Number);
            const logDate = new Date(data.logDate);
            logDate.setHours(hours, minutes, 0, 0); // Set hours and minutes
            const value: Omit<InputData, 'logTime'> = {
              systolic: data.systolic,
              diastolic: data.diastolic,
              pulse: data.pulse,
              logDate
            };
            try {
              await request({
                method: 'POST',
                url: '/api/user-blood-pressure',
                data: value
              });
              toast.success('Blood pressure record created successfully');
            } catch (error) {
              console.error('Error creating blood pressure record:', error);
              toast.error(
                typeof error === 'object' && error !== null && 'message' in error
                  ? (error as { message?: string }).message
                  : 'Failed to create blood pressure record'
              );
            }
            router.push('/blood-pressure'); // Redirect to dashboard after submission
          })
        })}
      >
        <div className="grid gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Blood Pressure Readings</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="systolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider font-bold">Systolic</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type="number" className="pr-12 text-lg font-semibold h-12" {...field} />
                      </FormControl>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground">mmHg</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diastolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider font-bold">Diastolic</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type="number" className="pr-12 text-lg font-semibold h-12" {...field} />
                      </FormControl>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground">mmHg</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span>Heart Rate</span>
            </div>
            <FormField
              control={form.control}
              name="pulse"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Input type="number" className="pr-12 h-12" placeholder="70" {...field} />
                    </FormControl>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground">BPM</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-6">
            <FormField
              control={form.control}
              name="logDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn("pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, 'MMM dd') : <span>Pick date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date => date > new Date() || date < new Date('1900-01-01')}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="time" className="h-10 pl-3 pr-8" {...field} />
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className={cn(
              "w-full h-12 text-base font-semibold shadow-lg transition-all",
              isPending
                ? "shadow-none opacity-80 cursor-not-allowed"
                : "shadow-primary/20 hover:translate-y-[-1px] active:translate-y-[0px]"
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Saving Record...</span>
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                <span>Save Record</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
