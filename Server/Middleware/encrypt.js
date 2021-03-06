const bcrypt = require("bcrypt");

encryptPassword = (password, callback) => {
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
            return callback(true, err)
        } else {
            return callback(false, hash)
        }
    })
}


decryptPassword = async (data, callback) => {
    await bcrypt.compare(data.password, password.hash, (err, result) => {
        if (err) {
            return callback(true, err)
        } else {
            return callback(false, result)
        }
    })
}


module.exports = {
    encryptPassword,
    decryptPassword
}