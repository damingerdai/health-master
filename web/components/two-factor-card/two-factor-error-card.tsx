import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';

interface TwoFactorErrorCardProps {
  error: string;
}

export function TwoFactorErrorCard({ error }: TwoFactorErrorCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Authenticator app</CardTitle>
        <CardDescription>
          Use a time-based verification code when signing in.
        </CardDescription>
      </CardHeader>
      <CardContent>{error}</CardContent>
    </Card>
  );
}
