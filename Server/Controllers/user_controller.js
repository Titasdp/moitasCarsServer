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
    const data = {}
    if (req.body.password && req.body.name) {
        encryptPack.encryptPassword(req.sanitize(req.body.password), (isError, result) => {
            if (isError) {

            } else {
                return callback(false, data)
            }

        })
    } else {
        return callback(false, 1)
    }

    sequelize
        .query(
            "INSERT INTO user (id_user, name, password) VALUES (:user);", {
                replacements: {
                    user: [
                        req.sanitize(uniqid(undefined, "-user")),
                        req.sanitize(req.body.name),
                        req.sanitize(hash),
                    ]
                }
            }, {
                model: userModel.User
            }
        )
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(false, error)
        });

};

updateCountry = (req, callback) => {
    sequelize
        .query(
            "UPDATE engine SET designation = :designation , horse_power =:horse_power Where engine.id_engine = :id_engine;", {
                replacements: {
                    id_country: req.sanitize(req.params.id_country),
                    designation: req.sanitize(req.body.designation),
                }
            }, {
                model: countryModel.Country
            }
        )
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(true, error)
        });
};


module.exports = {
    updateEngine,
    addEngine,
    getEngines
};