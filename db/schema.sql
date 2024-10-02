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