'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
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
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import {
  Calendar as CalendarIcon,
  Clock,
  Loader2,
  Ruler,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { request } from '@/lib/request';

const schema = z.object({
  height: z.coerce
    .number()
    .min(1, 'Height is required')
    .max(300, 'Height should be less than 300 cm'),
  logDate: z.date({
    required_error: 'Log date is required'
  }),
  logTime: z.string().optional()
});

type InputData = z.infer<typeof schema>;

export function CreateHeightForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const currentDate = new Date();
  const form = useForm<InputData>({
    resolver: zodResolver(schema),
    defaultValues: {
      height: 170,
      logDate: currentDate,
      logTime: format(currentDate, 'HH:mm')
    }
  });

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6', className)}
        {...props}
        onSubmit={form.handleSubmit(data => {
          startTransition(async () => {
            const [hours, minutes] = (
              data.logTime ?? format(new Date(), 'HH:mm')
            )
              .split(':')
              .map(Number);
            const recordDate = new Date(data.logDate);
            recordDate.setHours(hours, minutes, 0, 0);

            try {
              await request({
                method: 'POST',
                url: '/api/user-height',
                data: {
                  height: data.height,
                  recordDate: recordDate.toISOString()
                }
              });
              toast.success('Height record created successfully');
              router.push('/height');
            } catch (error) {
              console.error('Error creating height record:', error);
              toast.error(
                typeof error === 'object' &&
                  error !== null &&
                  'message' in error
                  ? (error as { message?: string }).message
                  : 'Failed to create height record'
              );
            }
          });
        })}
      >
        <div className="grid gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Ruler className="h-4 w-4" />
              <span>Height Reading</span>
            </div>

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider">
                    Body Height
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="300"
                        step="0.1"
                        className="h-12 pr-12 text-lg font-semibold"
                        {...field}
                      />
                    </FormControl>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground">
                      CM
                    </span>
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
                    <FormControl>
                      <PopoverTrigger
                        render={
                          <Button
                            variant="outline"
                            className={cn(
                              'h-10 pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          />
                        }
                      >
                        {field.value ? (
                          format(field.value, 'MMM dd')
                        ) : (
                          <span>Pick date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
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
                      <Input
                        type="time"
                        className="h-10 pl-3 pr-8"
                        {...field}
                      />
                      <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
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
              'h-12 w-full text-base font-semibold shadow-lg transition-all',
              isPending
                ? 'cursor-not-allowed opacity-80 shadow-none'
                : 'shadow-primary/20 hover:translate-y-[-1px] active:translate-y-[0px]'
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
