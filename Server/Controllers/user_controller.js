// Just for admins
const userModel = require("../Models/user_model")
const sequelize = require("../Database/connection")
const encryptPack = require("../Middleware/encrypt")
const uniqid = require('uniqid');

getUser = (req, callback) => {
    sequelize
        .query("SELECT * FROM user", {
            model: userModel.User
        })
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(false, error)
        });
};
addUser = (req, callback) => {
    const dataObj = {}
    if (req.body.password && req.body.name) {
        encryptPack.encryptPassword(req.sanitize(req.body.password), (isError, encryptResult) => {
            if (isError) {
                dataObj.data = null
                dataObj.msg = "Something went wrong please try again later"
                dataObj.error = encryptResult
                return callback(false, dataObj)
            } else {
                sequelize
                    .query(
                        "INSERT INTO user (id_user, name, password) VALUES (:user);", {
                            replacements: {
                                user: [
                                    req.sanitize(uniqid(undefined, "-user")),
                                    req.sanitize(req.body.name),
                                    req.sanitize(encryptResult),
                                ]
                            }
                        }, {
                            model: userModel.User
                        }
                    )
                    .then(data => {
                        dataObj.data = data
                        dataObj.msg = "The user was created successfully"
                        dataObj.error = error
                        return callback(true, dataObj)
                    })
                    .catch(insertError => {
                        dataObj.data = null
                        dataObj.msg = "Something went wrong please try again later"
                        dataObj.error = insertError
                        return callback(false, dataObj)
                    });
            }

        })
    } else {
        dataObj.data = null
        dataObj.msg = "There are fields that are empty, some fields must be filled"
        dataObj.error = null
        return callback(false, dataObj)
    }
};

updateUser = (req, callback) => {
    sequelize
        .query(
            "UPDATE user SET name = :name  Where user.id_user = :id_user;", {
                replacements: {
                    id_user: req.sanitize(req.params.id_user),
                    name: req.sanitize(req.body.name),
                }
            }, {
                model: userModel.User
            }
        )
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(true, error)
        });
};

fileUser = (req, callback) => {
    sequelize
        .query(
            "UPDATE user SET filed = :val  Where user.id_user = :id_user;", {
                replacements: {
                    id_user: req.sanitize(req.params.id_user),
                    val: req.sanitize(req.body.val),
                }
            }, {
                model: userModel.User
            }
        )
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(true, error)
        });
}


module.exports = {
    addUser,
    getUsers,
    updateUser,

};