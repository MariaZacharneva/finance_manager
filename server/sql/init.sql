DROP TABLE IF EXISTS init_table;
CREATE TABLE init_table
(
    id           bigserial PRIMARY KEY,
    text_message varchar(100)
);

INSERT INTO init_table (text_message)
VALUES ('first message');

INSERT INTO init_table (text_message)
VALUES ('second message');

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS spendings CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS spendings_to_categories CASCADE;

CREATE TABLE users
(
    user_id bigserial PRIMARY KEY,
    name    varchar(50),
    email   varchar(50)
);

INSERT INTO users(user_id, name, email)
VALUES (0, 'MASHA', 'masha@gmail.com');

CREATE TABLE spendings
(
    spending_id bigserial PRIMARY KEY,
    user_id     bigint NOT NULL REFERENCES users (user_id),
    description varchar(200),
    value       int,
    currency    varchar(10),
    date        bigint
);

CREATE TABLE groups
(
    group_id    bigserial PRIMARY KEY,
    user_id     bigint NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    description varchar(50)
);

CREATE TABLE categories
(
    category_id bigserial PRIMARY KEY,
    user_id     bigint NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    group_id    bigint NOT NULL REFERENCES groups (group_id) ON DELETE CASCADE,
    description varchar(50)
);

CREATE TABLE spendings_to_categories
(
    spending_id bigint NOT NULL REFERENCES spendings (spending_id) ON DELETE CASCADE,
    category_id bigint NOT NULL REFERENCES categories (category_id) ON DELETE CASCADE,
    group_id bigint NOT NULL REFERENCES groups(group_id) ON DELETE CASCADE,
    user_id bigint NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT group_to_spending PRIMARY KEY (group_id, spending_id)
);


