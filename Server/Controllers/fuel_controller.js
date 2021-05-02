const fuelTypeModel = require("../Models/fuel_model")
const sequelize = require("../Database/connection")
const uniqid = require('uniqid');

getFuels = (req, callback) => {
    sequelize
        .query("SELECT * FROM fuel", {
            model: fuelTypeModel.Fuel
        })
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(false, error)
        });
};



getFuelByName = (description, callback) => {
    sequelize
        .query("SELECT * FROM fuel where description =:desc", {
            replacements: {
                desc: description
            }
        }, {
            model: fuelTypeModel.Fuel
        })
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(false, error)
        });
};





addFuel = (req, callback) => {
    sequelize
        .query(
            "INSERT INTO fuel (id_fuel_type, designation) VALUES (:fuelType);", {
                replacements: {
                    fuelType: [
                        req.sanitize(uniqid(undefined, "-fuel")),
                        req.sanitize(req.body.designation),
                    ]
                }
            }, {
                model: fuelTypeModel.Fuel
            }
        )
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(false, error)
        });
};

updateFuel = (req, callback) => {
    sequelize
        .query(
            "UPDATE fuel SET designation = :designation Where fuel.id_fuel_type = :id_fuel_type;", {
                replacements: {
                    id_fuel_type: req.sanitize(req.params.id_fuel_type),
                    designation: req.sanitize(req.params.designation)
                }
            }, {
                model: fuelTypeModel.Fuel
            }
        )
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(true, error)
        });
};



initializeFuelModel = async (callback) => {
    let insertArray = [
        [uniqueIdPack.generateRandomId('-fuel'), 'Indefinido']
        [uniqueIdPack.generateRandomId('-fuel'), 'Gasolina'],
        [uniqueIdPack.generateRandomId('-fuel'), 'Gasóleo'],
        [uniqueIdPack.generateRandomId('-fuel'), 'Diesel'],
        [uniqueIdPack.generateRandomId('-fuel'), 'Ethanol'],
        [uniqueIdPack.generateRandomId('-fuel'), 'Eletricidade'],
    ]
    await sequelize
        .query(
            `INSERT INTO fuel (id_fuel_type,designation) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: fuelTypeModel.Fuel
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
    updateFuel,
    addFuel,
    getFuels,
    initializeFuelModel,
    getFuelByName
};