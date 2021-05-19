// Just for admins
const userModel = require("../Models/user_model")
const sequelize = require("../Database/connection")
const encryptPack = require("../Middleware/encrypt")
const generatePassPack = require("../Middleware/randomPassword")
const tokenPack = require("../Middleware/tokenFunctions")
const uniqid = require('uniqid');

//*Completed
userLogin = (dataObj, callback) => {
    let processResp = {}
    if (!dataObj.fetchConfirmExist) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "The username and password you entered did not match our records.",
            }
        }
        return callback(false, processResp)
    }
    encryptPack.decryptPassword({
        password: dataObj.password,
        hash: dataObj.userData.password,
    }, (isError, decryptResult) => {
        if (isError) {
            console.log(decryptResult);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong, please try again later.",
                }
            }
            return callback(false, processResp)

        } else {
            if (decryptResult) {
                tokenPack.generateToken({
                        user: {
                            id: dataObj.userData.id_user,
                            userCode: "moitasCars"
                        }
                    },
                    token => {
                        processResp = {
                            processRespCode: 200,
                            toClient: {
                                processResult: {
                                    token: token,
                                    username: dataObj.userData.username
                                },
                                processError: null,
                                processMsg: "Successful Login",
                            }
                        }
                        return callback(true, processResp)
                    }
                );
            } else {
                processResp = {
                    processRespCode: 400,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "The username and password you entered did not match our records.",
                    }
                }
                return callback(false, processResp)
            }
        }
    })
}

//*Completed
getUserByName = (req, callback) => {
    let processResp = {}
    sequelize
        .query("SELECT * FROM user where user.username = :username", {
            replacements: {
                username: req.sanitize(req.body.username)
            }
        }, {
            model: userModel.User
        })
        .then(data => {

            let respCode = 200
            let respMsg = "Data fetched successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: respMsg,
                }
            }
            return callback(true, processResp)
        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
};

//*Completed
getUserById = (req, callback) => {
    let processResp = {}
    sequelize
        .query("SELECT * FROM user where user.id_user =:id_user", {
            replacements: {
                id_user: req.sanitize(req.params.id)
            }
        }, {
            model: userModel.User
        })
        .then(data => {
            let respCode = 200
            let respMsg = "Data fetched successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: respMsg,
                }
            }
            return callback(true, processResp)
        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
};


//*Completed
fetchUsers = (req, callback) => {
    let processResp = {}
    sequelize
        .query("SELECT * FROM user", {
            model: userModel.User
        })
        .then(data => {
            let respCode = 200
            let respMsg = "Data fetched successfully."
            if (data.length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: respMsg,
                }
            }
            return callback(true, processResp)
        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
};




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

updateUserPassword = (dataObj, callback) => {
    let processResp = {}
    if (!dataObj.fetchConfirmExist) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "The username and password you entered did not match our records.",
            }
        }
        return callback(false, processResp)
    }
    encryptPack.decryptPassword({
        password: dataObj.oldPassword,
        hash: dataObj.userData.password
    }, (isError, decryptResult) => {
        if (isError) {
            console.log(decryptResult);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong, please try again later.",
                }
            }
            return callback(false, processResp)
        } else {
            if (decryptResult) {
                encryptPack.encryptPassword(dataObj.newPassword, (isErrorEncrypting, encryptResult) => {
                    if (isErrorEncrypting) {
                        processResp = {
                            processRespCode: 500,
                            toClient: {
                                processResult: null,
                                processError: null,
                                processMsg: "Something went wrong, please try again later.",
                            }
                        }
                        return callback(false, processResp)
                    } else {


                        sequelize
                            .query(
                                "UPDATE user SET password = :newPassword  Where user.id_user = :id_user", {
                                    replacements: {
                                        id_user: dataObj.userData.id_user,
                                        newPassword: encryptResult,
                                    }
                                }, {
                                    model: userModel.User
                                }
                            )
                            .then(data => {

                                processResp = {
                                    processRespCode: 200,
                                    toClient: {
                                        processResult: data[0],
                                        processError: null,
                                        processMsg: "User password updated successfully.",
                                    }
                                }
                                return callback(false, processResp)

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
                processResp = {
                    processRespCode: 400,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "The actual password doesn't match our records",
                    }
                }
                return callback(false, processResp)
            }
        }
    })
};


// *Completed
initUser = (dataObj, callback) => {
    let processResp = {}
    if (dataObj.fetchConfirmExist) {
        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Cannot complete the process this function can only be called one time, and it has been already called.",
            }
        }
        return callback(true, processResp)
    }
    let generatedPassword = generatePassPack.generateRandomPass()
    // let insertArray = [
    //     [uniqid(undefined, '-user'), 'moitasAdmin', generatedPassword],
    // ]


    encryptPack.encryptPassword(generatedPassword, (isError, encryptResult) => {



        if (isError) {
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong please try again later.",
                }
            }

            return callback(false, processResp)
        } else {
            let insertArray = [
                [uniqid(undefined, '-user'), 'moitasAdmin', encryptResult],
            ]
            sequelize
                .query(
                    `INSERT INTO user (id_user, username, password) VALUES ${insertArray.map(element => '(?)').join(',')}`, {
                        replacements: insertArray
                    }, {
                        model: userModel.User
                    }
                ).then(data => {


                    processResp = {
                        processRespCode: 201,
                        toClient: {
                            processResult: {
                                data: data,
                                generatedPassword: generatedPassword
                            },
                            processError: null,
                            processMsg: "Data introduced successfully.",
                        }
                    }
                    return callback(false, processResp)

                }).catch(insertError => {
                    console.log(insertError);
                    let processResp = {
                        processRespCode: 500,
                        toClient: {
                            processResult: null,
                            processError: error,
                            processMsg: "Something went wrong please try again later.",
                        }
                    }
                    return callback(false, processResp)
                });
        }
    })

};


module.exports = {
    addUser,
    updateUser,
    updateUserPassword,
    getUserByName,
    initUser,
    fetchUsers,
    userLogin,
    getUserById
};