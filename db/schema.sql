CREATE DATABASE stacktrack;

CREATE TABLE play_history (
    hand_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    blind_level VARCHAR,
    session_date DATE,
    win_loss INTEGER,
    notes TEXT
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_digest TEXT NOT NULL
);

INSERT INTO play_history (user_id, blind_level, session_date, win_loss, notes)
VALUES
(1, '2/5', '2024-09-25', 200.00, 'Solid session, ran well with pocket Aces.'),
(1, '2/3', '2024-09-26', -150.00, 'Lost a big hand on the river.'),
(1, '5/10', '2024-09-27', 50.00, 'Slow session but ended slightly up.'),
(1, '2/5', '2024-09-28', 400.00, 'Hit a flush on the turn for a big pot.'),
(1, '2/5', '2024-09-29', -100.00, 'Got bluffed off a hand but had a few good wins.');



ALTER TABLE dishes ADD COLUMN user_id INTEGER;

UPDATE dishes SET user_id = 1;

ALTER TABLE dishes ADD COLUMN categories TEXT;

UPDATE dishes SET categories = 'main';

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT,
    user_id INTEGER,
    dish_id INTEGER
);

SELECT * FROM dishes limit 3;

SELECT * FROM comments JOIN users on comments.user_id = users.id where comments.dish_id = 28;