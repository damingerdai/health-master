import { TriangleAlertIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { PasswordForm } from './password-form';

interface PasswordCardProps {
  twoFactorEnabled: boolean;
}

export function PasswordCard({ twoFactorEnabled }: PasswordCardProps) {
  return (
    <Card className="rounded-3xl border-stone-200/70 bg-white/85 py-6 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm sm:py-7 dark:border-stone-800/80 dark:bg-stone-900/70">
      <CardHeader className="flex flex-col justify-between gap-4 border-b border-stone-200/60 px-6 pb-5 sm:flex-row sm:items-center sm:px-7 dark:border-stone-800/70">
        <div className="space-y-1">
          <CardTitle className="text-lg font-medium text-stone-800 dark:text-stone-100">
            Change password
          </CardTitle>
          <CardDescription className="text-xs text-stone-500 dark:text-stone-400">
            Choose a strong password you do not use anywhere else.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 px-6 pt-5 sm:px-7">
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-800/15 bg-amber-900/5 p-4 text-sm leading-relaxed text-stone-700 dark:border-amber-500/20 dark:bg-amber-950/30 dark:text-stone-200">
          <TriangleAlertIcon
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-amber-700/70 dark:text-amber-400/80"
          />
          <span>
            Changing your password will sign you out on all devices, including
            this one. You will need to sign in again with your new password
            {twoFactorEnabled ? ' and your authenticator app' : ''}.
          </span>
        </div>
      </CardContent>

      <PasswordForm twoFactorEnabled={twoFactorEnabled} />
    </Card>
  );
}
