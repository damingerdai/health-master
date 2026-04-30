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
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Calendar as CalendarIcon, Clock, Loader2, Save, Thermometer, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { request } from '@/lib/request';

const schemas = z.object({
  temperature: z.coerce.number().min(30).max(113),
  unit: z.enum(['C', 'F']),
  note: z.string().max(500).optional(),
  logDate: z.date({
    required_error: 'Log date is required'
  }),
  logTime: z.string().optional()
}).refine(
  data => {
    if (data.unit === 'C') {
      return data.temperature >= 30 && data.temperature <= 45;
    } else if (data.unit === 'F') {
      return data.temperature >= 86 && data.temperature <= 113;
    }
    return false;
  },
  {
    message: 'Temperature must be between 30-45°C or 86-113°F depending on the unit',
    path: ['temperature']
  }
);

type InputData = z.infer<typeof schemas>;

export function CreateTemperatureForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const currentDate = new Date();
  const defaultValues: InputData = {
    temperature: 36.5,
    unit: 'C',
    logDate: currentDate,
    logTime: format(currentDate, 'HH:mm'),
    note: ''
  };

  const form = useForm({
    resolver: zodResolver(schemas),
    defaultValues
  });

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6', className)}
        {...props}
        onSubmit={form.handleSubmit(async (data: InputData) => {
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
              toast.error(
                typeof err === 'object' && err !== null && 'message' in err
                  ? (err as { message?: string }).message
                  : 'Failed to create temperature record'
              );
            }
          });
        })}
      >
        <div className="grid gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Thermometer className="h-4 w-4" />
              <span>Temperature Reading</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider font-bold">Temperature</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type="number" step="0.1" className="pr-12 text-lg font-semibold h-12" {...field} />
                      </FormControl>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                        °{form.watch('unit')}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider font-bold">Unit</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex h-12 items-center gap-4 bg-slate-50 dark:bg-zinc-800/50 rounded-lg px-4 border"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl><RadioGroupItem value="C" /></FormControl>
                          <FormLabel className="font-medium cursor-pointer text-sm">Celsius (°C)</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl><RadioGroupItem value="F" /></FormControl>
                          <FormLabel className="font-medium cursor-pointer text-sm">Fahrenheit (°F)</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>Notes (Optional)</span>
            </div>
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="Feeling sick, after exercise, etc." 
                      className="resize-none min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
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
