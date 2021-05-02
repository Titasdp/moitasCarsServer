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

getEngineByName = (description, callback) => {
    sequelize
        .query("SELECT * FROM engine where description =:desc", {
            replacements: {
                desc: description
            }
        }, {
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

initializeEngineModel = async (callback) => {
    let insertArray = [
        [uniqueIdPack.generateRandomId('-engine'), 'Indefinido']
        [uniqueIdPack.generateRandomId('-engine'), 'V4']
        [uniqueIdPack.generateRandomId('-engine'), 'V6']
        [uniqueIdPack.generateRandomId('-engine'), 'V8'],
        [uniqueIdPack.generateRandomId('-engine'), 'V12'],
        [uniqueIdPack.generateRandomId('-engine'), 'V'],
    ]
    await sequelize
        .query(
            `INSERT INTO engine (id_engine,designation) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: engineModel.Engine
            }
        )
        .then(data => {
            let processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "Data introduced successfully",
                }
            }
            return callback(false, processResp)
        })
        .catch(error => {
            let processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something went wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
};


module.exports = {
    updateEngine,
    addEngine,
    getEngines,
    initializeEngineModel,
    getEngineByName
};