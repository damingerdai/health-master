 ALTER TABLE users
DROP COLUMN IF EXISTS two_factor_verified_at,
DROP COLUMN IF EXISTS two_factor_secret,
DROP COLUMN IF EXISTS two_factor_enabled;
