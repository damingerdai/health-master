ALTER TABLE users_temperatures ADD COLUMN record_date TIMESTAMPTZ;
UPDATE users_temperatures SET record_date = created_at WHERE record_date IS NULL;
ALTER TABLE users_temperatures ALTER COLUMN record_date SET NOT NULL;

COMMENT ON COLUMN users_temperatures.record_date IS 'Actual date/time when temperature was measured (may differ from record creation time)';
CREATE INDEX IF NOT EXISTS idx_users_temperatures_record_date ON users_temperatures(record_date);