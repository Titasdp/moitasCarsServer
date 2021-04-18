// Just for admins
const userModel = require("../Models/user_model")
const sequelize = require("../Database/connection")
const encryptPack = require("../Middleware/encrypt")
const generatePassPack = require("../Middleware/randomPassword")
const tokenPack = require("../Middleware/tokenFunctions")
const uniqid = require('uniqid');

userLogin = (data, callback) => {
    encryptPack.decryptPassword({
        password: data.password,
        hash: data.userData.password,
    }, (isError, decryptResult) => {
        if (isError) {
            return callback(false, {
                msg: "something went wrong please try again, later",
                error: decryptResult,
                respCode: 500,
                token: null
            })
        } else {
            if (decryptResult) {
                tokenPack.generateToken({
                        user: {
                            id: data.userData.id_user,
                            userCode: "moitasCars"
                        }
                    },
                    token => {
                        return callback(true, {
                            msg: "Successful Login",
                            error: null,
                            token: token,
                            respCode: 200,
                            username: data.userData.username
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
        .query("SELECT * FROM user where user.username = :username", {
            replacements: {
                username: req.sanitize(req.body.username)
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


getUserById = (req, callback) => {
    sequelize
        .query("SELECT * FROM user where user.id_user = :id_user", {
            replacements: {
                id_user: req.sanitize(req.params.id_user)
            }
        }, {
            model: userModel.User
        })
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(false, error)
        });
};


// getUsers = (req, callback) => {
//     sequelize
//         .query("SELECT * FROM user", {
//             model: userModel.User
//         })
//         .then(data => {
//             return callback(true, data)
//         })
//         .catch(error => {
//             return callback(false, error)
//         });
// };

addUser = (req, callback) => {
    if (req.body.name) {
        let generatedPassword = generatePassPack.generateRandomPass()
        encryptPack.encryptPassword(req.sanitize(generatedPassword), (isError, encryptResult) => {
            if (isError) {
                return callback(false, {
                    msg: "Something went wrong please try again later",
                    error: encryptResult
                })
            } else {
                sequelize
                    .query(
                        "INSERT INTO user (id_user, username, password) VALUES (:user);", {
                            replacements: {
                                user: [
                                    req.sanitize(uniqid(undefined, "_User")),
                                    req.sanitize(req.body.name),
                                    req.sanitize(encryptResult),
                                ]
                            }
                        }, {
                            model: userModel.User
                        }
                    ).then(data => {
                        return callback(true, {
                            returnData: data,
                            msg: "The user was created successfully",
                            error: null,
                            generatedPassword: generatedPassword
                        })
                    }).catch(insertError => {
                        return callback(false, {
                            msg: "Something went wrong please try again later",
                            error: insertError
                        })
                    });
            }
        })
    } else {
        return callback(false, {
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



updateUserPassword = (data, callback) => {

    encryptPack.decryptPassword({
        password: data.oldPassword,
        hash: data.userData.password
    }, (isError, decryptResult) => {
        if (isError) {
            return callback(false, {
                msg: "something went wrong please try again, later",
                error: decryptResult,
                respCode: 500,
            })
        } else {
            if (decryptResult) {
                encryptPack.encryptPassword(data.newPassword, (isErrorEncrypting, encryptResult) => {
                    if (isErrorEncrypting) {
                        return callback(false, {
                            msg: "Something went wrong please try again, later!",
                            error: encryptResult,
                            respCode: 500,
                        })
                    } else {
                        sequelize
                            .query(
                                "UPDATE user SET password = :newPassword  Where user.id_user = :id_user", {
                                    replacements: {
                                        id_user: data.userData.id_user,
                                        newPassword: encryptResult,
                                    }
                                }, {
                                    model: userModel.User
                                }
                            )
                            .then(data => {
                                return callback(true, {
                                    data: data[0],
                                    msg: "User password updated successfully.",
                                    error: null,
                                    respCode: 201,
                                })
                            })
                            .catch(error => {
                                return callback(false, {
                                    data: null,
                                    msg: "Something went wrong please try again, later!",
                                    error: error,
                                    respCode: 500,
                                })
                            });
                    }
                })
            } else {
                return callback(false, {
                    data: null,
                    msg: "The password that has been introduce doesn't match our data.",
                    error: null,
                    respCode: 401,
                })
            }
        }
    })
};














// fileUser = (req, callback) => {
//     sequelize
//         .query(
//             "UPDATE user SET filed = :val  Where user.id_user = :id_user;", {
//                 replacements: {
//                     id_user: req.sanitize(req.params.id_user),
//                     val: req.sanitize(req.body.val),
//                 }
//             }, {
//                 model: userModel.User
//             }
//         )
//         .then(data => {
//             return callback(true, data)
//         })
//         .catch(error => {
//             return callback(true, error)
//         });
// }

// eliminateUser = (req, callback) => {
//     sequelize
//         .query(
//             "DELETE FROM user Where user.id_user = :id_user;", {
//                 replacements: {
//                     id_user: req.sanitize(req.params.id_user),
//                 }
//             }, {
//                 model: userModel.User
//             }
//         )
//         .then(data => {
//             return callback(true, data)
//         })
//         .catch(error => {
//             return callback(true, error)
//         });
// }

module.exports = {
    addUser,
    // getUsers,
    updateUser,
    getUserById,
    // fileUser,
    // eliminateUser,
    updateUserPassword,
    getUserByName,
    userLogin
};