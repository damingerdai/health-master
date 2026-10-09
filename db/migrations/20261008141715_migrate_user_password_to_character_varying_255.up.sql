ALTER TABLE users ALTER COLUMN password TYPE character varying(255);
COMMENT ON COLUMN users.password IS 'Password hash stored in standard Argon2id PHC format';