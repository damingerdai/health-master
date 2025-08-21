-- Create the users_temperatures table
CREATE TABLE IF NOT EXISTS users_temperatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    temperature DECIMAL(4,1) NOT NULL,
    unit VARCHAR(2) NOT NULL DEFAULT 'C' CHECK (unit IN ('C', 'F')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT valid_temperature CHECK (
        (unit = 'C' AND temperature BETWEEN 30 AND 45) OR
        (unit = 'F' AND temperature BETWEEN 86 AND 113)
    )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_temperatures_user_id ON users_temperatures(user_id);
CREATE INDEX IF NOT EXISTS idx_users_temperatures_created_at ON users_temperatures(created_at);
CREATE INDEX IF NOT EXISTS idx_users_temperatures_deleted_at ON users_temperatures(deleted_at);

-- Add comment to the table
COMMENT ON TABLE users_temperatures IS 'Stores users body temperature measurements';

-- Add column comments
COMMENT ON COLUMN users_temperatures.id IS 'Primary key, auto-generated UUID';
COMMENT ON COLUMN users_temperatures.user_id IS 'Foreign key referencing users table';
COMMENT ON COLUMN users_temperatures.temperature IS 'The temperature value';
COMMENT ON COLUMN users_temperatures.unit IS 'Temperature unit (C for Celsius, F for Fahrenheit)';
COMMENT ON COLUMN users_temperatures.notes IS 'Optional notes about the measurement';
COMMENT ON COLUMN users_temperatures.created_at IS 'Timestamp when record was created';
COMMENT ON COLUMN users_temperatures.created_by IS 'User who created the record';
COMMENT ON COLUMN users_temperatures.updated_at IS 'Timestamp when record was last updated';
COMMENT ON COLUMN users_temperatures.updated_by IS 'User who last updated the record';
COMMENT ON COLUMN users_temperatures.deleted_at IS 'Timestamp when record was soft-deleted';