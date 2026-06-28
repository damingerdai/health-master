interface Props {
  enabled: boolean;
}

export function TwoFactorCard({
  enabled,
}: Props) {
  if (enabled) {
    return <div>EnabledView</div>;
  }

  return <div>SetupView</div>
}