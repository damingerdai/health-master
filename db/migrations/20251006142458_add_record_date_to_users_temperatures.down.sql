DROP INDEX IF EXISTS idx_users_temperatures_record_date;

COMMENT ON COLUMN users_temperatures.record_date IS NULL;

ALTER TABLE users_temperatures DROP COLUMN record_date;