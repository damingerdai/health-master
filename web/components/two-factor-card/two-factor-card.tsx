import { CheckCircle2Icon, ShieldIcon } from 'lucide-react';
import { TwoFactorSetup } from '@/types/twofactor';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { SetupView } from './setup-view';
import { TwoFactorForm } from './two-factor-form';

interface TwoFactorCardProps {
  twoFactorSetup: TwoFactorSetup;
}

export function TwoFactorCard({ twoFactorSetup }: TwoFactorCardProps) {
  return (
    <Card className="rounded-3xl border-stone-200/70 bg-white/85 py-6 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm sm:py-7 dark:border-stone-800/80 dark:bg-stone-900/70">
      <CardHeader className="flex flex-col justify-between gap-4 border-b border-stone-200/60 px-6 pb-5 sm:flex-row sm:items-center sm:px-7 dark:border-stone-800/70">
        <div className="space-y-1">
          <CardTitle className="text-lg font-medium text-stone-800 dark:text-stone-100">
            Authenticator app
          </CardTitle>
          <CardDescription className="text-xs text-stone-500 dark:text-stone-400">
            Use a time-based verification code when signing in.
          </CardDescription>
        </div>

        {twoFactorSetup && (
          <span
            className={
              twoFactorSetup.enabled
                ? 'inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-700/20 bg-emerald-900/5 px-3 py-1 text-xs font-medium text-[#3F6254] dark:border-emerald-500/30 dark:bg-emerald-950/50 dark:text-emerald-300'
                : 'inline-flex w-fit items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100/80 px-3 py-1 text-xs font-medium text-stone-500 dark:border-stone-800 dark:bg-stone-800/60 dark:text-stone-400'
            }
          >
            {twoFactorSetup.enabled ? (
              <CheckCircle2Icon className="size-3.5" aria-hidden="true" />
            ) : (
              <ShieldIcon className="size-3.5" aria-hidden="true" />
            )}
            <span>{twoFactorSetup.enabled ? 'Enabled' : 'Disabled'}</span>
          </span>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-6 px-6 pt-5 sm:px-7">
        {!twoFactorSetup.enabled && twoFactorSetup.secret && (
          <SetupView setup={twoFactorSetup} />
        )}
        {twoFactorSetup.enabled && (
          <div className="rounded-2xl border border-emerald-800/15 bg-emerald-900/5 p-4 text-sm leading-relaxed text-stone-700 dark:border-emerald-500/20 dark:bg-emerald-950/30 dark:text-stone-200">
            Your account is quietly protected. You will be asked for a 6-digit
            code from your authenticator app when signing in.
          </div>
        )}
      </CardContent>

      <TwoFactorForm
        enabled={twoFactorSetup.enabled}
        canEnable={!!twoFactorSetup.secret}
      />
    </Card>
  );
}
