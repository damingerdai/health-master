import { TwoFactorSetup } from '@/types/twofactor';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SetupView } from './setup-view';
import { TwoFactorForm } from './two-factor-form';

interface TwoFactorCardProps {
  twoFactorSetup: TwoFactorSetup;
}

export function TwoFactorCard({ twoFactorSetup }: TwoFactorCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Authenticator app</CardTitle>
        <CardDescription>
          Use a time-based verification code when signing in.
        </CardDescription>
        {twoFactorSetup && (
          <Badge variant={twoFactorSetup.enabled ? 'default' : 'secondary'}>
            {twoFactorSetup.enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {!twoFactorSetup.enabled && twoFactorSetup.secret && (
          <SetupView setup={twoFactorSetup} />
        )}
        {twoFactorSetup.enabled && (
          <p>
            Your account is protected. You will need a code from your
            authenticator app when signing in.
          </p>
        )}
      </CardContent>
      <TwoFactorForm
        enabled={twoFactorSetup.enabled}
        canEnable={!!twoFactorSetup.secret}
      />
    </Card>
  );
}
