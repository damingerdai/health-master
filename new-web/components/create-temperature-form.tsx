"use client";

import { CalendarIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { request } from "@/lib/request";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schemas = z
  .object({
    temperature: z.coerce.number().min(30).max(113),
    unit: z.enum(["C", "F"]),
    note: z.string().max(500).optional(),
    logDate: z.date({
      required_error: "Log date is required",
    }),
    logTime: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.unit === "C") {
        return data.temperature >= 30 && data.temperature <= 45;
      } else if (data.unit === "F") {
        return data.temperature >= 86 && data.temperature <= 113;
      }
      return false;
    },
    {
      message:
        "Temperature must be between 30-45°C or 86-113°F depending on the unit",
      path: ["temperature"],
    },
  );

type CreateTemperatureData = z.infer<typeof schemas>;

export function CreateTemperatureForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const defaultValues: CreateTemperatureData = {
    temperature: 36.5,
    unit: "C",
    logDate: new Date(),
    logTime: format(new Date(), "HH:mm"),
    note: "",
  };
  const form = useForm({ resolver: zodResolver(schemas), defaultValues });
  const router = useRouter();
  return (
    <Form {...form}>
      <form
        className={className}
        {...props}
        onSubmit={form.handleSubmit(async (data: CreateTemperatureData) => {
          // Handle form submission
          const { logDate, logTime } = data;
          const [hours, minutes] = logTime?.split(":").map(Number) as [
            number,
            number,
          ];
          const recordDate = new Date(logDate);
          recordDate.setHours(hours, minutes, 0, 0);
          const value: Omit<CreateTemperatureData, "logTime" | "logDate"> & {
            recordDate: Date;
          } = {
            temperature: data.temperature,
            unit: data.unit,
            recordDate,
          };
          try {
            await request({
              method: "POST",
              url: "/api/user-temperature",
              data: value,
            });
            toast.success("Temperature record created successfully");
            router.push("/temperature");
          } catch (err) {
            console.error(err);
            toast.error(
              typeof err === "object" && err !== null && "message" in err
                ? (err as { message?: string }).message
                : "Failed to create temperature record",
            );
          }
        })}
      >
        <div className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} step={0.1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col"
                    >
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="C" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Celsius (°C)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="F" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Fahrenheit (°F)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="gird gap-3">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grip gap-3">
            <FormField
              control={form.control}
              name="logDate"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Record Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="logTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Record Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      id="time-pocker"
                      step="60"
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
