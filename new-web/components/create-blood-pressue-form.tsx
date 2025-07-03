"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { request } from "@/lib/request";
import { toast } from "sonner";
import { ca } from "date-fns/locale";
import { useRouter } from "next/navigation";

const schemas = z.object({
    systolic: z.number().min(0, "Systolic is required"),
    diastolic: z.number().min(0, "Diastolic is required"),
    pulse: z.number().min(0, "Pulse is required"),
    logDate: z.date({
        required_error: "Log date is required",
    }),
    logTime: z.string().optional(),
});

type InputData = z.infer<typeof schemas>;

export function CreateBloodPressureForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const defaultValues: InputData = {
        systolic: 120,
        diastolic: 80,
        pulse: 70,
        logDate: new Date(),
        logTime: format(new Date(), "HH:mm"), // Default to current time
    };
    const form = useForm({ resolver: zodResolver(schemas), defaultValues });
    const router = useRouter();

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
                        systolic: data.systolic,
                        diastolic: data.diastolic,
                        pulse: data.pulse,
                        logDate
                    };
                    try {
                        await request({
                            method: "POST",
                            url: "/api/user-blood-pressure",
                            data: value,
                        });
                        toast.success("Blood pressure record created successfully");
                    } catch (error) {
                        console.error("Error creating blood pressure record:", error);
                        toast.error(
                            typeof error === "object" && error !== null && "message" in error
                                ? (error as { message?: string }).message
                                : "Failed to create blood pressure record"
                        );
                    }
                    router.push("/blood-pressure"); // Redirect to dashboard after submission
                })}
            >
                <div className="grid gap-6">
                    <div className="grid gap-3">
                        <FormField
                            control={form.control}
                            name="systolic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        ></FormField>
                    </div>
                    <div className="grid gap-3">
                        <FormField
                            control={form.control}
                            name="diastolic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Diastolic</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        ></FormField>
                    </div>
                    <div className="grid gap-3">
                        <FormField
                            control={form.control}
                            name="pulse"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pulse</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        ></FormField>
                    </div>
                    <div className="grid gap-3">
                        <FormField
                            control={form.control}
                            name="logDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Log Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
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
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                captionLayout="dropdown"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {/* <FormDescription>
                                        Your date of birth is used to calculate your age.
                                    </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        ></FormField>
                    </div>
                    <Button type="submit" className="w-full">
                        Create
                    </Button>
                </div>
            </form>
        </Form>
    );
}
