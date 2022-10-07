CREATE TYPE GENDER AS ENUM ('M', 'F', 'U');

CREATE TABLE IF NOT EXISTS users (
    id UUID NOT NULL DEFAULT gen_random_uuid (),
    username VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(32) NOT NULL,
    gender GENDER,
    created_at  TIMESTAMPTZ NOT NULL,
    updated_at  TIMESTAMPTZ,
    deleted_at  TIMESTAMPTZ,
    PRIMARY KEY (id)
);
