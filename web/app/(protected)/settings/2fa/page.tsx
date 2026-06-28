import { TwoFactorCard } from "@/components/two-factor-card";

export default async function TwoFactorPage() {
  // TODO
  // const user = await getCurrentUser();

  const enabled = false;

  return (
    <div className="container max-w-2xl p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Two-Factor Authentication
          </h1>

          <p className="text-muted-foreground">
            Protect your account with an additional verification step.
          </p>
        </div>

        <TwoFactorCard enabled={enabled} />
      </div>
    </div>
  );
}