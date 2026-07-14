"use client";

import Link from "next/link";
import {
  ShieldCheck,
  KeyRound,
  Monitor,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SecurityItem } from "./security-item";

interface SecurityCardProps {
  twoFactorEnabled: boolean;
}

export function SecurityCard({
  twoFactorEnabled,
}: SecurityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>
          Manage your account security settings.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {/* Two Factor */}
        <SecurityItem
          icon={
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          }
          title="Two-Factor Authentication"
          description="Require a verification code when signing in."
          badge={
            <Badge
              variant={
                twoFactorEnabled ? "default" : "secondary"
              }
            >
              {twoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          }
          action={
            <Button asChild>
              <Link href="/settings/2fa">
                {twoFactorEnabled ? "Manage" : "Enable"}
              </Link>
            </Button>
          }
        />

        <Separator />

        {/* Password */}
        <SecurityItem
          icon={
            <KeyRound className="h-5 w-5 text-muted-foreground" />
          }
          title="Password"
          description="Change your account password."
          action={
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          }
        />

        <Separator />

        {/* Sessions */}
        <SecurityItem
          icon={
            <Monitor className="h-5 w-5 text-muted-foreground" />
          }
          title="Active Sessions"
          description="View and manage devices signed into your account."
          action={
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
}

