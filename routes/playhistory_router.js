const express = require('express')
const db = require('../db')

const router = express.Router()

router.get('/playhistory', (req, res) => {
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

router.get('/playhistory/:handId/edit', (req, res) => {
    const sql = `
    SELECT * FROM play_history 
    WHERE hand_id = $1;
    `

    db.query(sql, [req.params.handId], (err, result) => {
        const hand = result.rows[0]

        if (result.rows[0].user_id !== req.session.userId) {
            return res.send('You do not have permission.')
        }

        res.render('play_edit_form', {hand})
    })
})

router.get('/playhistory/new', (req, res) => {
    res.render('new_play_form')
})

router.post('/playhistory', (req, res) => {
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

router.put('/playhistory/:handId', (req, res) => {
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

router.delete('/playhistory/:handId', (req, res) => {
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

module.exports = router