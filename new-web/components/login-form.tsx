"use client";

import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schemas = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
type InputData = z.infer<typeof schemas>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const defaultValues: InputData = {
    username: "",
    password: "",
  };

  const router = useRouter();

  const form = useForm({ resolver: zodResolver(schemas), defaultValues });
  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        {...props}
        onSubmit={form.handleSubmit(async (data: InputData) => {
          try {
            const { username, password } = data;
            const res = await signIn("credentials", {
              redirect: false,
              username,
              password,
            });
            if (!res?.ok) {
              toast("Login failed", {
                description: res?.error,
                position: "top-right",
              });
              return;
            }
            console.log("Login successful", res);
            // const res = await request({
            //   url: "api/login",
            //   method: "POST",
            //   headers: {
            //     username: data.username,
            //     password: data.password,
            //   },
            // });
            // localStorage.setItem("user", res);
            router.push("/dashboard");
          } catch (err) {
            const message = (err as Record<"message", string>).message ?? "";
            if (message) {
              toast.error(message, {
                position: "top-right",
              });
            }
          }
        })}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your username below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="username"
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
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      Password
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="sign-up" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
      </form>
    </Form>
  );
}
