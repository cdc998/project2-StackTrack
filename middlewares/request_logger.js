function requestLogger(req, res, next)  {
    console.log(`\n+-----------------REQUEST------------------+`)
    console.log(new Date().toLocaleString())
    console.log(`${req.method} ${req.path}`)
    console.log(`body `, req.body)
    console.log(`+-----------------REQUEST------------------+\n`)
    next()
}

module.exports = requestLogger