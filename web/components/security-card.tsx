'use client';
import * as React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  KeyRound,
  Monitor,
  CheckCircle2Icon,
  ShieldIcon
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SecurityItem } from './security-item';

interface SecurityCardProps {
  twoFactorEnabled: boolean;
}

const primaryLinkClassName = cn(
  buttonVariants({}),
  'h-9 rounded-xl bg-[#3F6254] px-4 text-xs font-medium text-stone-50 hover:bg-[#345246] dark:bg-emerald-700 dark:text-stone-50 dark:hover:bg-emerald-600'
);

const outlineLinkClassName = cn(
  buttonVariants({ variant: 'outline' }),
  'h-9 rounded-xl border-stone-200 bg-white px-4 text-xs font-medium text-stone-700 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800'
);

export function SecurityCard({ twoFactorEnabled }: SecurityCardProps) {
  return (
    <Card className="rounded-3xl border-stone-200/70 bg-white/85 py-6 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm sm:py-7 dark:border-stone-800/80 dark:bg-stone-900/70">
      <CardHeader className="border-b border-stone-200/60 px-6 pb-5 sm:px-7 dark:border-stone-800/70">
        <CardTitle className="text-lg font-medium text-stone-800 dark:text-stone-100">
          Security
        </CardTitle>
        <CardDescription className="text-xs text-stone-500 dark:text-stone-400">
          Manage your account security settings.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {/* Two Factor */}
        <SecurityItem
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Two-Factor Authentication"
          description="Require a verification code when signing in."
          badge={
            <span
              className={
                twoFactorEnabled
                  ? 'inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-700/20 bg-emerald-900/5 px-3 py-1 text-xs font-medium text-[#3F6254] dark:border-emerald-500/30 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : 'inline-flex w-fit items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100/80 px-3 py-1 text-xs font-medium text-stone-500 dark:border-stone-800 dark:bg-stone-800/60 dark:text-stone-400'
              }
            >
              {twoFactorEnabled ? (
                <CheckCircle2Icon className="size-3.5" aria-hidden="true" />
              ) : (
                <ShieldIcon className="size-3.5" aria-hidden="true" />
              )}
              <span>{twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
            </span>
          }
          action={
            <Link href="/settings/2fa" className={primaryLinkClassName}>
              {twoFactorEnabled ? 'Manage' : 'Enable'}
            </Link>
          }
        />

        <Separator className="bg-stone-200/60 dark:bg-stone-800/70" />

        {/* Password */}
        <SecurityItem
          icon={<KeyRound className="h-5 w-5" />}
          title="Password"
          description="Change your account password."
          action={
            <Link href="/settings/password" className={outlineLinkClassName}>
              Change
            </Link>
          }
        />

        <React.Activity mode="hidden">
          <Separator className="bg-stone-200/60 dark:bg-stone-800/70" />

          {/* Sessions */}
          <SecurityItem
            icon={<Monitor className="h-5 w-5" />}
            title="Active Sessions"
            description="View and manage devices signed into your account."
            action={
              <Button
                variant="outline"
                disabled
                className="h-9 rounded-xl border-stone-200 bg-white px-4 text-xs font-medium text-stone-700 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
              >
                Coming Soon
              </Button>
            }
          />
        </React.Activity>
      </CardContent>
    </Card>
  );
}
