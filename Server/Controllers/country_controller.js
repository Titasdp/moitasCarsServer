const countryModel = require("../Models/country_model")
const sequelize = require("../Database/connection")
const uniqid = require('uniqid');

getCountries = (req, callback) => {
    sequelize
        .query("SELECT * FROM countries", {
            model: countryModel.Country
        })
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(false, error)
        });
};
addCountry = (req, callback) => {
    sequelize
        .query(
            "INSERT INTO country (id_country, designation) VALUES (:country);", {
                replacements: {
                    country: [
                        req.sanitize(uniqid(undefined, "-country")),
                        req.sanitize(req.body.designation),
                        req.sanitize(req.body.horse_power),
                    ]
                }
            }, {
                model: countryModel.Country
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
                    id_engine: req.sanitize(req.params.id_country),
                    designation: req.sanitize(req.body.designation),
                }
            }, {
                model: engineModel.Engine
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