"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { request } from "@/lib/request";
import { toast } from "sonner";

const schemas = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .regex(
        /^[A-Za-z0-9]+$/,
        "Username must contain only letters and numbers",
      ),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    gender: z
      .string()
      .regex(/^[MFU]$/, { message: "Gender must be M or F" })
      .optional(),
    password: z
      .string()
      .min(1, "Password is required")
      .regex(
        /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
        "Password must contain both letters and numbers, and be 8-16 characters long",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type InputData = z.infer<typeof schemas>;

export function RegistryForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const defaultValues: InputData = {
    username: "",
    firstName: "",
    lastName: "",
    gender: "U",
    password: "",
    confirmPassword: "",
  };
  const form = useForm({ resolver: zodResolver(schemas), defaultValues });

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        {...props}
        onSubmit={form.handleSubmit(async (data: InputData) => {
          try {
            await request({
              method: "post",
              url: "/api/user",
              data: {
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                password: data.password,
              },
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (err: any) {
            console.log(err);
            toast.error("fail to register a new user", {
              position: "top-right",
            });
          }
        })}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Wellcome to Heath Master</h1>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            ></FormField>
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="gird gap-3">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col"
                      >
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="M" />
                          </FormControl>
                          <FormLabel className="font-normal">Man</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="F" />
                          </FormControl>
                          <FormLabel className="font-normal">Felman</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="U" />
                          </FormControl>
                          <FormLabel className="font-normal">Unkown</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <Button type="submit" className="w-full">
            Sign up
          </Button>
        </div>
        <div className="text-center text-sm">
          Do you have an account?{" "}
          <a href="sign-in" className="underline underline-offset-4">
            Sign in
          </a>
        </div>
      </form>
    </Form>
  );
}
