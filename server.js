require('dotenv').config()

const express = require('express')
const app = express()
const port = 4444
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const session = require('express-session')

const requestLogger = require('./middlewares/request_logger')
const setCurrentUser = require('./middlewares/set_current_user')
const ensureLoggedIn = require('./middlewares/ensure_logged_in')

const sessionRouter = require('./routes/session_router')
const playhistoryRouter = require('./routes/playhistory_router')
const highlightRouter = require('./routes/highlight_router')
const commentRouter = require('./routes/comment_router')

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

app.use(highlightRouter)

app.use(commentRouter)

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})