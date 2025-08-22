-- Drop the indexes first
DROP INDEX IF EXISTS idx_users_temperatures_user_id;
DROP INDEX IF EXISTS idx_users_temperatures_created_at;
DROP INDEX IF EXISTS idx_users_temperatures_deleted_at;

-- Then drop the table
DROP TABLE IF EXISTS users_temperatures;