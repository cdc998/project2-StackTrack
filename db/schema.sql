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

CREATE TABLE highlight_plays (
    highlight_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    hole_card_1 VARCHAR,
    hole_card_2 VARCHAR,
    hand_description TEXT NOT NULL,
    stage TEXT NOT NULL,
    action TEXT NOT NULL,
    blind_level VARCHAR,
    session_date DATE
);

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    highlight_id INTEGER,
    user_id INTEGER,
    comment_text TEXT NOT NULL
);


INSERT INTO play_history (user_id, blind_level, session_date, win_loss, notes) VALUES 
(1, '1/2', '2024-09-20', 150, 'Played cautiously after a big blind re-raise. Bluff worked out in my favor.'),
(1, '2/5', '2024-09-21', -75, 'Folded pre-flop several times. Opponent’s aggressive raises put me on the defensive.'),
(1, '1/2', '2024-09-22', 100, 'Gained chips with a well-timed river bet. Was aggressive and took control.'),
(1, '5/10', '2024-09-23', -250, 'Overestimated my opponent’s hand. Tried to bluff on a weak hand but failed.'),
(1, '1/2', '2024-09-25', 200, 'Played with patience, and capitalized on a few big hands. Overall a solid session.'),
(2, '1/3', '2024-09-19', 300, 'Caught some great cards and played them aggressively. Profited well.'),
(2, '2/5', '2024-09-20', 120, 'Made smart plays on the river and outmaneuvered opponents.'),
(2, '1/2', '2024-09-21', -50, 'Lost a bit after calling a large river bet on a weak hand.'),
(2, '1/3', '2024-09-22', 180, 'Strong read on opponents helped me push the edge and gain chips.'),
(2, '5/10', '2024-09-23', -200, 'Bluffed too often, lost big on several hands.'),
(3, '1/2', '2024-09-20', -100, 'Misread an opponent’s bluff. Played cautiously but it wasn’t enough.'),
(3, '2/5', '2024-09-21', 250, 'Started off slow but gained momentum with strong pocket pairs.'),
(3, '5/10', '2024-09-22', -150, 'Tried an all-in move, got called, and lost the hand.'),
(3, '1/3', '2024-09-23', 75, 'Folded early but caught a big hand and doubled up near the end of the session.'),
(3, '1/2', '2024-09-25', 100, 'Played tight and focused, took a few calculated risks that paid off.');

INSERT INTO play_history (user_id, blind_level, session_date, win_loss, notes) VALUES 
(1, '1/3', '2024-09-26', 180, 'Caught some good hands and played aggressive. Took down a few large pots.'),
(1, '5/10', '2024-09-27', -300, 'Bluffed a bit too much. Got called down and paid the price.'),
(1, '2/5', '2024-09-28', 220, 'Played a patient game, only entered strong hands and won consistently.'),
(1, '1/2', '2024-09-29', -50, 'Had a rough start, tried to recover but wasn’t able to.'),
(1, '5/10', '2024-09-30', 400, 'Played aggressively on the river and got paid off by an opponent bluff.'),
(1, '2/5', '2024-10-01', 150, 'Smart play, slowly building the pot, and won with two pair.'),
(1, '1/2', '2024-10-02', 70, 'Mostly small pots, played cautiously but made a bit of profit.'),
(2, '1/2', '2024-09-24', 130, 'Played aggressively after catching two pair, made a good profit.'),
(2, '5/10', '2024-09-25', -250, 'Overplayed a top pair, lost a lot of chips on the river.'),
(2, '2/5', '2024-09-26', 300, 'Made a great value bet on the turn, opponent called and I took the pot.'),
(2, '1/3', '2024-09-27', -60, 'Played cautiously but still lost after a big blind re-raise.'),
(2, '2/5', '2024-09-28', 240, 'Solid session, caught a full house on the river and took down a huge pot.'),
(2, '5/10', '2024-09-29', -100, 'Misjudged the board and got trapped in an all-in hand.'),
(2, '1/2', '2024-09-30', 220, 'Played well against a tight opponent, slow-played pocket aces.'),
(2, '2/5', '2024-10-01', 170, 'Chipped up consistently, mostly medium pots but no big swings.'),
(2, '1/3', '2024-10-02', -40, 'Called a bad bluff, lost on the river. Should have folded.'),
(2, '5/10', '2024-10-03', 500, 'Had a great session, flopped a set and turned a full house.'),
(3, '1/2', '2024-09-26', -75, 'Got caught in a bluff, tried to recover but still ended the session down.'),
(3, '2/5', '2024-09-27', 300, 'Played cautiously, caught a straight on the river and doubled up.'),
(3, '5/10', '2024-09-28', -200, 'Aggressive play backfired, lost on an all-in call.');



INSERT INTO highlight_plays (user_id, hole_card_1, hole_card_2, hand_description, stage, action, blind_level, session_date) VALUES
(1, '39', '0', 'Raised pre-flop with pocket aces, opponent called. The flop came all hearts, and I continued betting aggressively.', 'Turn', 'Raise', '1/2', '2024-09-20'),
(1, '12', '38', 'Went all-in after the turn with a set of kings. Opponent folded after a long thought.', 'River', 'All-in', '2/5', '2024-09-21'),
(2, '37', '50', 'Played queens conservatively after an aggressive pre-flop raise. Ended up winning a big pot on the river.', 'River', 'Call', '1/3', '2024-09-19'),
(2, '23', '49', 'Caught a set on the flop and slowly built the pot until the river, where I went all-in and took the pot.', 'Turn', 'All-in', '2/5', '2024-09-20'), 
(3, '13', '38', 'Flopped top pair and slow-played the turn. Opponent over-bet the river and I called to win.', 'River', 'Call', '1/2', '2024-09-20'),
(3, '47', '34', 'Caught a set on the flop and let the opponent bet into me. Went all-in on the river and won.', 'River', 'All-in', '2/5', '2024-09-21'),
(1, '24', '11', 'Slow-played pocket queens, opponent went all-in on the river after missing his straight draw.', 'River', 'Call', '1/2', '2024-09-26'),
(1, '26', '51', 'Caught top pair on the flop, bet aggressively on every street, and opponent folded on the turn.', 'Turn', 'Raise', '2/5', '2024-09-28'),
(2, '25', '12', 'Flopped a set of kings, slow-played until the river and went all-in. Opponent folded.', 'River', 'All-in', '5/10', '2024-10-03'),
(3, '0', '8', 'Flopped top pair with ace kicker. Played cautiously and induced a river bluff from the opponent.', 'River', 'Call', '1/3', '2024-09-27'),
(3, '49', '10', 'Caught a set on the flop, let the opponent bet into me, and went all-in on the river for a huge pot.', 'River', 'All-in', '2/5', '2024-09-26');



INSERT INTO comments (highlight_id, user_id, comment_text) VALUES
(1, 2, 'Well played! That aggressive move on the turn really paid off.'),
(1, 3, 'I would have bet bigger on the flop, but nice hand!'),
(2, 1, 'I don’t think I would have gone all-in there, risky move.'),
(3, 3, 'Great call on the river! That must have been a tough decision.'),
(4, 1, 'Smart move, you played those pocket jacks perfectly.'),
(1, 3, 'Nice trap with the pocket aces! That was a bold move.'),
(2, 2, 'Well played with the kings, I would have raised bigger on the flop though.'),
(3, 1, 'Great hand! The river bluff was unexpected, but you nailed it.'),
(4, 2, 'That was a tough call on the river. Maybe could’ve folded?'),
(5, 3, 'Solid move with the pocket jacks, slow-playing them worked well.'),
(6, 1, 'Nice value bet on the turn! Got the most out of the hand.'),
(7, 2, 'I would have played the queens differently, but your move worked!'),
(8, 3, 'Good call, taking down the pot with ace-king.'),
(9, 1, 'Well-played kings, you had him trapped the whole way.'),
(10, 2, 'That was a sick move, slow-playing the set of kings.'),
(11, 3, 'I wouldn’t have slow-played that ace-nine, but it worked out in the end.'),
(12, 1, 'Strong all-in on the river, great play.'),
(13, 3, 'I loved how you played that hand, especially on the turn.'),
(14, 2, 'That bluff on the river was risky, but it paid off.'),
(15, 1, 'Solid game plan with the queens, loved the execution.');