CREATE DATABASE stacktrack;

CREATE TABLE play_history (
    play_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    blind_level VARCHAR,
    session_date DATE,
    win_loss INTEGER,
    notes TEXT
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password_digest TEXT
);

INSERT INTO play_history (user_id, blind_id, session_date, win_loss_amount, session_duration, notes)
VALUES
(1, '2/5', '2024-09-25', 200.00, '02:30:00', 'Solid session, ran well with pocket Aces.'),
(1, '2/3', '2024-09-26', -150.00, '01:45:00', 'Lost a big hand on the river.'),
(1, '5/10', '2024-09-27', 50.00, '03:15:00', 'Slow session but ended slightly up.'),
(1, '2/5', '2024-09-28', 400.00, '04:00:00', 'Hit a flush on the turn for a big pot.'),
(1, '2/5', '2024-09-29', -100.00, '02:00:00', 'Got bluffed off a hand but had a few good wins.');



INSERT INTO dishes (title, image_url, description) VALUES ('cake', 'https://www.recipetineats.com/tachyon/2020/08/My-best-Vanilla-Cake_9-SQ.jpg', 'vanilla cake');

INSERT INTO dishes (title, image_url, description) VALUES ('bubble tea', 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Bubble_Tea.png', 'bubble tea');

INSERT INTO dishes (title, image_url, description) VALUES ('skewers', 'https://www.kitchensanctuary.com/wp-content/uploads/2016/04/Honey-Garlic-Chicken-Skewers-square-FS-21.jpg', 'honey garlic chicken skewers');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    password_digest TEXT
);

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