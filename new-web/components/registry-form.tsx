import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function RegistryForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Wellcome to Heath Master</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="firstName">Frist Name</Label>
          <Input id="firstName" type="text" required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="firstName">Last Name</Label>
          <Input id="lastName" type="text" required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="gender">Gender</Label>
          <RadioGroup id="gender" defaultValue="F">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="M" id="gender-m" />
              <Label htmlFor="gender-m">Man</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="F" id="gender-f" />
              <Label htmlFor="gender-f">Felman</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="U" id="gender-u" />
              <Label htmlFor="gender-u"> Unkown</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
          </div>
          <Input id="confirmPassword" type="password" required />
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
  );
}
