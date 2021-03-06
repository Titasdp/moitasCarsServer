const engineModel = require("../Models/engine_model")
const sequelize = require("../Database/connection")
const uniqid = require('uniqid');

getEngines = (req, callback) => {
    sequelize
        .query("SELECT * FROM engine", {
            model: engineModel.Engine
        })
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(false, error)
        });
};
addEngine = (req, callback) => {
    sequelize
        .query(
            "INSERT INTO engine (id_engine, designation,horse_power) VALUES (:engineType);", {
                replacements: {
                    engineType: [
                        req.sanitize(uniqid(undefined, "-engine")),
                        req.sanitize(req.body.designation),
                        req.sanitize(req.body.horse_power),
                    ]
                }
            }, {
                model: engineModel.Engine
            }
        )
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(false, error)
        });
};

updateEngine = (req, callback) => {
    sequelize
        .query(
            "UPDATE engine SET designation = :designation , horse_power =:horse_power Where engine.id_engine = :id_engine;", {
                replacements: {
                    id_engine: req.sanitize(req.params.id_engine),
                    designation: req.sanitize(req.body.designation),
                    horse_power: req.sanitize(req.body.horse_power)
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