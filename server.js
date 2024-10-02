require('dotenv').config()

const express = require('express')
const app = express()
const port = 4444
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const session = require('express-session')

const db = require ('./db/index')

const bcrypt = require('bcrypt')

const requestLogger = require('./middlewares/request_logger')
const setCurrentUser = require('./middlewares/set_current_user')


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

app.get('/playhistory', (req, res) => {
    const sql = `
    SELECT * FROM 
    play_history WHERE 
    user_id = $1
    ORDER BY 
    session_date DESC;
    `

    db.query(sql, [req.session.userId], (err, result) => {
        if (err) {
            console.log(err)
        }

        console.log(result)

        let handsHistory = result.rows

        res.render('play_history', {handsHistory})
    })
}) 

app.get('/playhistory/:handId/edit', (req, res) => {
    const sql = `
    SELECT * FROM play_history 
    WHERE hand_id = $1;
    `

    db.query(sql, [req.params.handId], (err, result) => {
        const hand = result.rows[0]
        res.render('play_edit_form', {hand})
    })
})

app.get('/playhistory/new', (req, res) => {
    res.render('new_play_form')
})

app.post('/playhistory', (req, res) => {
    const user_id = req.session.userId
    const blind_level = req.body.blind_level
    const session_date = req.body.session_date
    const win_loss = req.body.win_loss
    const notes = req.body.notes

    const sql = `
    INSERT INTO play_history 
    (user_id, blind_level, session_date, win_loss, notes) 
    VALUES 
    ($1, $2, $3, $4, $5)
    `

    db.query(sql, [user_id, blind_level, session_date, win_loss, notes], (err, result) => {
        if (err) {
            console.log(err)
        }

        res.redirect('/playhistory')
    })
})

app.put('/playhistory/:handId', (req, res) => {
    const blind_level = req.body.blind_level
    const session_date = req.body.session_date
    const win_loss = req.body.win_loss
    const notes = req.body.notes
    const hand_id = req.body.hand_id

    const sql = `
    UPDATE play_history 
    SET blind_level = $1, session_date = $2, 
    win_loss = $3, notes = $4
    WHERE hand_id = $5;
    `

    db.query(sql, [blind_level, session_date, win_loss, notes, hand_id], (err, result) => {
        if (err) {
            console.log(err)
        }

        console.log(result)

        res.redirect('/playhistory')
    })
})

app.delete('/playhistory/:handId', (req, res) => {
    const sql = `
    DELETE FROM play_history 
    WHERE hand_id = $1;
    `

    db.query(sql, [req.params.handId], (err, result) => {
        if (err) {
            console.log(err)
        }
        res.redirect('/playhistory')
    })
})







app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const sql =`
    SELECT * FROM users 
    WHERE email = $1
    `

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.log(err)
        }

        if (result.rows.length === 0) {
            return res.send('user not found')
        }

        const user = result.rows[0]

        bcrypt.compare(password, user.password_digest, (err, isCorrect) => {
            if (err) {
                console.log(err)
            }

            if (!isCorrect) {
                return res.send('password is wrong')
            }

            req.session.userId = user.user_id

            res.redirect('/playhistory')
        })
    })
})

app.get('/signup', (req, res) => {
    res.render('sign_up')
})

app.post('/signup', (req, res) => {
    console.log(req.body)

    let username = req.body.username
    let email = req.body.email
    let plainTextPass = req.body.password
    let saltRounds = 10

    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(plainTextPass, salt, (err, hash) => {
            const sql = `
            INSERT INTO users 
            (username, email, password_digest)
            VALUES
            ($1, $2, $3)
            RETURNING *;
            `

            db.query(sql, [username, email, hash], (err, result) => {
                if (err) {
                    console.log(err)
                }
                
                res.redirect('/')
            })
        })
    })
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})