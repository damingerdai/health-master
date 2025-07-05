"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { formatDate, format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { request } from "@/lib/request";

const schemas = z.object({
  weight: z.coerce
    .number()
    .max(500, "Weight should be less than 500")
    .min(0, "Weight is required"),
  logDate: z.date({
    required_error: "Log date is required",
  }),
  logTime: z.string().optional(),
});
type InputData = z.infer<typeof schemas>;

export const CreateWieghtForm = ({
  className,
  ...props
}: React.ComponentProps<"form">) => {
  const router = useRouter();
  const currentDate = new Date();
  const defaultValues: InputData = {
    weight: 80,
    logDate: currentDate,
    logTime: formatDate(currentDate, "HH:mm"),
  };
  const form = useForm({
    resolver: zodResolver(schemas),
    defaultValues,
  });
  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        {...props}
        onSubmit={form.handleSubmit(async (data: InputData) => {
          const logTime = data.logTime ?? format(new Date(), "HH:mm"); // Use provided time or default to current time
          // Parse the logTime to set hours and minutes
          // Assuming logTime is in "HH:mm" format
          const [hours, minutes] = logTime.split(":").map(Number);
          const logDate = new Date(data.logDate);
          logDate.setHours(hours, minutes, 0, 0); // Set hours and minutes
          const value: Omit<InputData, "logTime"> = {
            weight: data.weight,
            logDate,
          };
          try {
            await request({
              method: "POST",
              url: "/api/user-weight",
              data: value,
            });
            toast.success("Weight record created successfully");
            router.push("/weight");
          } catch (err) {
            console.error("Error creating weight record:", err);
            toast.error(
              typeof err === "object" && err !== null && "message" in err
                ? (err as { message?: string }).message
                : "Failed to create weight record",
            );
          }
        })}
      >
        <div className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              name="weight"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              name="logDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Log Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-1")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            ></FormField>
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="logTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      id="time-picker"
                      step="60"
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      {...field}
                    ></Input>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
};
