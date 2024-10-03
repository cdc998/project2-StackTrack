require('dotenv').config()

const express = require('express')
const app = express()
const port = 4444
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const session = require('express-session')

const db = require ('./db/index')

const requestLogger = require('./middlewares/request_logger')
const setCurrentUser = require('./middlewares/set_current_user')
const ensureLoggedIn = require('./middlewares/ensure_logged_in')

const sessionRouter = require('./routes/session_router')
const playhistoryRouter = require('./routes/playhistory_router')

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"))
app.use(requestLogger)
app.use(express.static('public'))
app.use(session({
    cookie: {maxAge: 1000 * 60 * 60 * 3},
    secret: process.env.SESSION_COOKIE,
    resave: false,
    saveUninitialized: true
}))
app.use(setCurrentUser)
app.use(expressLayouts)

app.get('/', (req, res) => {
    res.render('home')
})

app.use(sessionRouter)

app.use(ensureLoggedIn)

app.use(playhistoryRouter)

app.get('/highlights', (req, res) => {
    const sql = `
    SELECT highlight_plays.*, users.username 
    FROM highlight_plays 
    JOIN users
    ON highlight_plays.user_id = users.user_id
    `

    const currentUserId = req.session.userId

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
        }

        let highlightHands = result.rows

        res.render('highlights', {highlightHands, currentUserId})
    })
})

app.get('/highlight/:highlightId', (req, res) => {
    const sql = `
    SELECT highlight_plays.*, users.username 
    FROM highlight_plays 
    JOIN users ON highlight_plays.user_id = users.user_id 
    WHERE highlight_plays.highlight_id = $1;
    `

    const currentUserId = req.session.userId

    db.query(sql, [req.params.highlightId], (err, result) => {
        if (err) {
            console.log(err)
        }

        let highlightHand = result.rows[0]

        const sql = `
        SELECT comments.*, users.username 
        FROM comments 
        JOIN users ON comments.user_id = users.user_id 
        WHERE comments.highlight_id = $1;
        `

        db.query(sql, [req.params.highlightId], (err, result) => {
            if (err) {
                console.log(err)
            }

            let comments = result.rows

            res.render('highlight', {highlightHand, currentUserId, comments})
        })
    })
})

app.get('/highlights/new', (req, res) => {
    res.render('new_highlight_form')
})

app.get('/highlights/:highlightId/edit', (req, res) => {
    const sql = `
    SELECT * FROM highlight_plays 
    WHERE highlight_id = $1;
    `

    db.query(sql, [req.params.highlightId], (err, result) => {
        const highlight = result.rows[0]
        res.render('highlight_edit_form', {highlight})
    })
})

app.post('/highlights', (req, res) => {
    const user_id = req.session.userId
    const blind_level = req.body.blind_level
    const session_date = req.body.session_date
    const hole_card1 = req.body.hole_card_1
    const hole_card2 = req.body.hole_card_2
    const hand_description = req.body.hand_description
    const stage = req.body.stage
    const action = req.body.action

    const sql = `
    INSERT INTO highlight_plays 
    (user_id, blind_level, session_date, hole_card_1, hole_card_2, hand_description, stage, action) 
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8)
    `

    db.query(sql, [user_id, blind_level, session_date, hole_card1, hole_card2, hand_description, stage, action], (err, result) => {
        if (err) {
            console.log(err)
        }

        res.redirect('/highlights')
    })
})

app.put('/highlights/:highlightId', (req, res) => {
    const user_id = req.session.userId
    const blind_level = req.body.blind_level
    const session_date = req.body.session_date
    const hole_card1 = req.body.hole_card_1
    const hole_card2 = req.body.hole_card_2
    const hand_description = req.body.hand_description
    const stage = req.body.stage
    const action = req.body.action
    const highlight_id = req.params.highlightId

    const sql = `
    UPDATE highlight_plays 
    SET user_id = $1, blind_level = $2, 
    session_date = $3, hole_card_1 = $4, hole_card_2 = $5  
    hand_description = $6, stage = $7, 
    action = $8 
    WHERE highlight_id = $9;
    `

    db.query(sql, [user_id, blind_level, session_date, hole_card1, hole_card2, hand_description, stage, action, highlight_id], (err, result) => {
        if (err) {
            console.log(err)
        }

        console.log(result)

        res.redirect('/highlights')
    })
})

app.delete('/highlights/:highlightId', (req, res) => {
    const sql = `
    DELETE FROM highlight_plays 
    WHERE highlight_id = $1;
    `

    db.query(sql, [req.params.highlightId], (err, result) => {
        if (err) {
            console.log(err)
        }
        res.redirect('/highlights')
    })
})

app.post('/comments', (req, res) => {
    const highlightId = req.body.highlight_id
    const userId = req.session.userId
    const comment = req.body.comment

    const sql = `
    INSERT INTO comments 
    (highlight_id, user_id, comment_text) 
    VALUES ($1, $2, $3)
    `

    db.query(sql, [highlightId, userId, comment], (err, result) => {
        if (err) {
            console.log(err);
        }

        res.redirect(`/highlight/${highlightId}`)
    })
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})