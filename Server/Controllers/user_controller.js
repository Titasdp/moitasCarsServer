// Just for admins
const userModel = require("../Models/user_model")
const sequelize = require("../Database/connection")
const encryptPack = require("../Middleware/encrypt")
const uniqid = require('uniqid');

userLogin = (data, callback) => {
    encryptPack.decryptPassword({
        password: data.user.password,
        hash: data.hash
    }, (isError, decryptResult) => {
        if (isError) {
            return callback(false, {
                msg: "something went wrong please try agin, later",
                error: decryptResult,
                respCode: 500,
                token: null
            })
        } else {
            if (decryptResult) {
                tokenMiddleware.generateToken({
                        user: {
                            id: data.user.id_user,
                            userCode: "moitasCars"
                        }
                    },
                    token => {
                        return callback({
                            msg: "Successful Login",
                            error: null,
                            token: token,
                            respCode: 200,
                            username: data.user.id_user
                        });
                    }
                );
            } else {
                return callback(false, {
                    msg: "The username and password you entered did not match our records.",
                    error: "",
                    respCode: 400,
                    token: null
                })
            }
        }
    })
}

getUserByName = (req, callback) => {
    sequelize
        .query("SELECT * FROM user where user.name = :name user.filed!= 1", {
            replacements: {
                name: req.sanitize(req.body.username)
            }
        }, {
            model: userModel.User
        })
        .then(data => {
            return callback(true, data[0])
        })
        .catch(error => {
            return callback(false, error)
        });
};

getUsers = (req, callback) => {
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
    if (req.body.password && req.body.name) {
        encryptPack.encryptPassword(req.sanitize(req.body.password), (isError, encryptResult) => {
            if (isError) {
                return callback(false, {
                    data: null,
                    msg: "Something went wrong please try again later",
                    error: encryptResult
                })
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
                        return callback(true, {
                            data: data,
                            msg: "The user was created successfully",
                            error: null
                        })
                    })
                    .catch(insertError => {
                        return callback(false, {
                            data: null,
                            msg: "Something went wrong please try again later",
                            error: insertError
                        })
                    });
            }
        })
    } else {
        return callback(false, {
            data: null,
            msg: "There are fields that are empty, some fields must be filled",
            error: null
        })
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

eliminateUser = (req, callback) => {
    sequelize
        .query(
            "DELETE FROM user Where user.id_user = :id_user;", {
                replacements: {
                    id_user: req.sanitize(req.params.id_user),
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
    fileUser,
    eliminateUser,
    getUserByName,
    userLogin
};