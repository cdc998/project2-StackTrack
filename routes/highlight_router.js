const express = require('express')
const db = require('../db')

const router = express.Router()

router.get('/highlights', (req, res) => {
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

router.get('/highlight/:highlightId', (req, res) => {
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

router.get('/highlights/new', (req, res) => {
    res.render('new_highlight_form')
})

router.get('/highlights/:highlightId/edit', (req, res) => {
    const sql = `
    SELECT * FROM highlight_plays 
    WHERE highlight_id = $1;
    `

    db.query(sql, [req.params.highlightId], (err, result) => {
        const highlight = result.rows[0]

        if (result.rows[0].user_id !== req.session.userId) {
            return res.send('You do not have permission.')
        }

        res.render('highlight_edit_form', {highlight})
    })
})

router.post('/highlights', (req, res) => {
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

router.put('/highlights/:highlightId', (req, res) => {
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

router.delete('/highlights/:highlightId', (req, res) => {
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

module.exports = router