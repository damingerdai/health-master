'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { TwoFactorSetup } from '@/types/twofactor';

export function SetupView({ setup }: { setup: TwoFactorSetup }) {
  return (
    <div className="flex flex-col gap-4">
      <p>
        Scan this QR code with your authenticator app, then enter its 6-digit
        code below.
      </p>
      {setup.qr_code_image && (
        <Image
          src={setup.qr_code_image}
          alt="Authenticator setup QR code"
          width={256}
          height={256}
          unoptimized
          className="max-w-full self-center"
        />
      )}
      <p className="text-sm text-muted-foreground">
        Unable to scan? Enter this setup key manually. Keep it private.
      </p>
      <code className="break-all select-all">{setup.secret}</code>
      <Button
        type="button"
        variant="outline"
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
        Copy setup key
      </Button>
    </div>
  );
}
