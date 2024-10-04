const express = require('express')
const db = require('../db')

const router = express.Router()

router.post('/comments', (req, res) => {
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

router.get('/comments/:comment_id/edit', (req, res) => {
    const sql = `
    SELECT * FROM comments 
    WHERE comment_id = $1;
    `

    db.query(sql, [req.params.comment_id], (err, result) => {
        const comment = result.rows[0]

        if (result.rows[0].user_id !== req.session.userId) {
            return res.send('You do not have permission.')
        }

        res.render('comment_edit_form', {comment})
    })
})

router.put('/comments/:comment_id', (req, res) => {
    const comment = req.body.comment

    const sql = `
    UPDATE comments  
    SET comment_text = $1 
    WHERE comment_id = $2 
    RETURNING *;
    `

    db.query(sql, [comment, req.params.comment_id], (err, result) => {
        if (err) {
            console.log(err)
        }

        console.log(result)

        let highlightId = result.rows[0].highlight_id

        res.redirect(`/highlight/${highlightId}`)
    })
})

router.delete('/comments/:comment_id', (req, res) => {
    const sql = `
    DELETE FROM comments 
    WHERE comment_id = $1 
    RETURNING *
    `

    db.query(sql, [req.params.comment_id], (err, result) => {
        if (err) {
            console.log(err)
        }

        console.log(result)

        let highlightId = result.rows[0].highlight_id

        res.redirect(`/highlight/${highlightId}`)
    })
})

module.exports = router