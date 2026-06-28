CREATE TABLE admin_users
(
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(180)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    full_name     VARCHAR(180)  NOT NULL,
    role          VARCHAR(40)   NOT NULL DEFAULT 'ADMIN',
    enabled       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMP
);

CREATE INDEX idx_admin_users_email ON admin_users (email);
