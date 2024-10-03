const express = require('express')
const db = require('../db')
const bcrypt = require('bcrypt')

const router = express.Router()

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
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

router.get('/signup', (req, res) => {
    res.render('sign_up')
})

router.post('/signup', (req, res) => {
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

router.delete('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
        }

        res.redirect('/')
    })
})

module.exports = router