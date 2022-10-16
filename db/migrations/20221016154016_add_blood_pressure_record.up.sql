CREATE TABLE IF NOT EXISTS user_blood_pressure (
    id UUID NOT NULL DEFAULT gen_random_uuid (),
    user_id  UUID NOT NULL,
    diastolic_blood_pressure INTEGER NOT NULL,
    systolic_blood_pressure INTEGER NOT NULL,
    pulse INTEGER NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL,
    updated_at  TIMESTAMPTZ,
    deleted_at  TIMESTAMPTZ,
    PRIMARY KEY (id),
     FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX IF NOT EXISTS user_blood_pressure_user_id_idx ON user_blood_pressure USING btree (user_id);
