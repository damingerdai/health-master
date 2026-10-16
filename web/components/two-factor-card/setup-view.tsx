'use client';

import { QRCodeSVG } from 'qrcode.react';
import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { TwoFactorSetup } from '@/types/twofactor';

export function SetupView({ setup }: { setup: TwoFactorSetup }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
        Scan this QR code with your authenticator app, then enter its 6-digit
        code below.
      </p>

      {setup.qr_code && (
        <div className="mx-auto flex items-center justify-center rounded-2xl border border-stone-200/80 bg-[#FAF8F5] p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-950">
          <QRCodeSVG
            value={setup.qr_code}
            size={200}
            className="max-w-full rounded-lg"
          />
        </div>
      )}

      <div className="space-y-2.5 rounded-2xl border border-stone-200/70 bg-[#FAF8F5]/70 p-4 dark:border-stone-800/80 dark:bg-stone-950/50">
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Unable to scan? Enter this setup key manually. Keep it private.
        </p>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <code className="rounded-xl border border-stone-200/80 bg-white px-3 py-2 font-mono text-xs break-all text-stone-700 select-all dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200">
            {setup.secret}
          </code>
          <Button
            type="button"
            variant="outline"
            className="h-9 shrink-0 gap-1.5 rounded-xl border-stone-200 bg-white text-xs text-stone-700 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(setup.secret ?? '');
                toast.success('Setup key copied');
              } catch {
                toast.error(
                  'Unable to copy. Select and copy the setup key manually.'
                );
              }
            }}
          >
            <CopyIcon className="size-3.5" aria-hidden="true" />
            <span>Copy setup key</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
