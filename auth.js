const auth = function (req, res, next) {
    if (req.session.userId) {
        console.log('middleware working...')
        next()
    } else {
        res.status(200).json({ "msg": "you have not verified your registration, please verify" })
    }
}

module.exports = auth; 
