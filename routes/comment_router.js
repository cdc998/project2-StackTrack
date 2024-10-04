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

module.exports = router