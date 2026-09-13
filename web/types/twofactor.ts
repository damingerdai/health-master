export interface TwoFactorSetup {
  enabled: boolean;
  secret?: string;
  qr_code?: string;
  qr_code_image?: string;
}
