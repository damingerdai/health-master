CREATE TABLE tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,     -- SHA-256 hash of the raw token
    category VARCHAR(50) NOT NULL,       -- e.g., 'password_reset', 'api_session', 'email_verify'
    metadata JSONB,                      -- Flexible storage for extra context
    
    starts_at TIMESTAMPTZ NOT NULL,      -- Effective time
    expires_at TIMESTAMPTZ NOT NULL,     -- Expiration time
    
    max_uses INT DEFAULT 1,              -- -1 for unlimited, 1 for single-use
    used_count INT DEFAULT 0,            -- Incrementing counter
    
    is_revoked BOOLEAN DEFAULT FALSE,    -- Manual revocation flag
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ
);

-- Index for optimized lookups
CREATE INDEX idx_tokens_active_lookup ON tokens (token_hash, category) WHERE is_revoked = FALSE;