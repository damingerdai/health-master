ALTER TABLE users
ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN two_factor_secret TEXT,
ADD COLUMN two_factor_verified_at TIMESTAMPTZ;
