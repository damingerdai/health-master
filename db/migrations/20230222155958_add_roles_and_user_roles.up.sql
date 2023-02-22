CREATE TABLE roles (
    id uuid not null default gen_random_uuid(),
    name varchar(100) not null,
    description text not null,
    create_dt timestamp not null,
    create_user varchar(50) not null,
    update_dt timestamp not null,
    update_user varchar(50) not null,
    PRIMARY KEY (id)
);

INSERT INTO roles (name, description, create_dt, create_user, update_dt, update_user) VALUES('admin', 'Admin', now(), 'system', now(), 'system');
INSERT INTO roles (name, description, create_dt, create_user, update_dt, update_user) VALUES('users', 'Standard User', now(), 'system', now(), 'system');

CREATE TABLE IF NOT EXISTS user_roles
  (
     id           UUID NOT NULL DEFAULT gen_random_uuid ()
     , user_id    UUID NOT NULL
     , role_id    UUID NOT NULL
     , created_at TIMESTAMPTZ NOT NULL
     , updated_at TIMESTAMPTZ
     , deleted_at TIMESTAMPTZ,
     PRIMARY KEY (id),
     FOREIGN KEY (user_id) REFERENCES users (id),
     FOREIGN KEY (role_id) REFERENCES roles (id),
     CONSTRAINT user_roles_unique_user_role_id UNIQUE (user_id, role_id)
  );

CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON user_roles USING btree (user_id);
CREATE INDEX IF NOT EXISTS user_roles_role_id_idx ON user_roles USING btree (role_id);

INSERT INTO user_roles  (user_id, role_id, created_at, updated_at) SELECT users.id, roles.id, statement_timestamp(), statement_timestamp() FROM users LEFT JOIN roles ON roles.name = 'users';
INSERT INTO user_roles  (user_id, role_id, created_at, updated_at) SELECT users.id, roles.id, statement_timestamp(), statement_timestamp() FROM users LEFT JOIN roles ON roles.name = 'admin' LIMIT 1 ;
