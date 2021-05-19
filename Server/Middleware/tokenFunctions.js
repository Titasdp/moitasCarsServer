var jwt = require("jsonwebtoken");

const generateToken = (user_info, callback) => {
    let secret = process.env.SECRET;
    let token = jwt.sign({
            data: user_info
        },
        secret, {
            expiresIn: "24h"
        }
    );
    return callback(token);
};

const validateTokenAndIfAdmin = (token, callback) => {
    let processResp = {}
    if (!token) {

        processResp = {
            processRespCode: 401,
            toClient: {
                processResult: null,
                processError: error,
                processMsg: "INVALID TOKEN!",
            }
        }
        return callback(false, processResp)
    }
    let secret = process.env.SECRET;
    jwt.verify(token.replace("Bearer ", ""), secret, function (error, brokenToken) {

        if (error) {
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
        } else {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: brokenToken.data.user.id,
                    processError: null,
                    processMsg: "VALID TOKEN!",
                }
            }
            return callback(true, processResp)


        }

        // return callback(true);

    });
};

module.exports = {
    generateToken,
    validateTokenAndIfAdmin,
};