import { AlertCircleIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';

interface PasswordErrorCardProps {
  error: string;
}

export function PasswordErrorCard({ error }: PasswordErrorCardProps) {
  return (
    <Card className="rounded-3xl border-stone-200/70 bg-white/85 py-6 shadow-[0_12px_40px_-12px_rgba(120,113,108,0.1)] backdrop-blur-sm dark:border-stone-800/80 dark:bg-stone-900/70">
      <CardHeader className="px-6 sm:px-7">
        <CardTitle className="text-lg font-medium text-stone-800 dark:text-stone-100">
          Change password
        </CardTitle>
        <CardDescription className="text-xs text-stone-500 dark:text-stone-400">
          Choose a strong password you do not use anywhere else.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 sm:px-7">
        <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200/80 bg-rose-50/70 px-4 py-3 text-xs leading-relaxed text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircleIcon
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />
          <span>{error}</span>
        </div>
      </CardContent>
    </Card>
  );
}
