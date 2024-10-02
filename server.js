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
    res.render('play_history')
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

                const user = result.rows[0]
                
                res.redirect('/', {user})
            })
        })
    })
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})