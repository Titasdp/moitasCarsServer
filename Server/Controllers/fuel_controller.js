const fuelTypeModel = require("../Models/fuel_model")
const sequelize = require("../Database/connection")
const uniqid = require('uniqid');

//*Completed
fetchFuels = (req, callback) => {
    let processResp = {}
    sequelize
        .query("SELECT * FROM fuel", {
            model: fuelTypeModel.Fuel
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
                    processError: error,
                    processMsg: "Something went wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
};

// *Completed
fetchFuelById = (id, callback) => {
    let processResp = {}
    sequelize
        .query("SELECT * FROM fuel where id_fuel_type =:id_fuel_type", {
            replacements: {
                id_fuel_type: id
            }
        }, {
            model: fuelTypeModel.Fuel
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
                    processError: error,
                    processMsg: "Something went wrong please try again later",
                }
            }
            return callback(false, processResp)
        });


}


// *Completed
fetchFuelByName = (designation, callback) => {
    let processResp = {}
    sequelize
        .query("SELECT * FROM fuel where designation =:designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: fuelTypeModel.Fuel
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
                    processError: error,
                    processMsg: "Something went wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
};

//*Completed
addFuel = (dataObj, callback) => {
    let processResp = {}

    if (dataObj.fetchConfirmExist) {
        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There is already a brand with that designation, introduced in the system.",
            }
        }
        return callback(true, processResp)
    }

    sequelize
        .query(
            "INSERT INTO fuel (id_fuel_type, designation) VALUES (:fuelType);", {
                replacements: {
                    fuelType: [
                        req.sanitize(uniqid(undefined, "-fuel")),
                        dataObj.newDesignation,
                    ]
                }
            }, {
                model: fuelTypeModel.Fuel
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "A new engine type was been created successfully.",
                }
            }
            return callback(true, processResp)
        })
        .catch(error => {
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something went wrong please try again later.",
                }
            }
            return callback(false, processResp)
        });
};

//*Completed
updateFuel = (dataObj, callback) => {
    let processResp = {}

    if (!dataObj.canBeEdited) {
        processResp = {
            processRespCode: 405,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "This data cannot be edited.",
            }
        }
        return callback(true, processResp)
    }
    if (dataObj.fetchConfirmExist) {
        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There is already an engine with that designation, introduced in the system.",
            }
        }
        return callback(true, processResp)
    }

    sequelize
        .query(
            "UPDATE fuel SET designation = :designation Where fuel.id_fuel_type = :id_fuel_type;", {
                replacements: {
                    id_fuel_type: dataObj.idFuelType,
                    designation: dataObj.newDesignation
                }
            }, {
                model: fuelTypeModel.Fuel
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "The brand was updated successfully",
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
                    processMsg: "Something went wrong, please try again later.",
                }
            }
            return callback(true, processResp)
        });
};


//Completed
initializeFuelModel = async (dataObj, callback) => {
    if (dataObj.fetchConfirmExist) {
        let processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Cannot complete the process this function can only be called one time, and it has been already called.",
            }
        }
        return callback(true, processResp)
    }

    let insertArray = [
        [uniqid(undefined, '-fuel'), 'Indefinido'],
        [uniqid(undefined, '-fuel'), 'Gasolina'],
        [uniqid(undefined, '-fuel'), 'Gasóleo'],
        [uniqid(undefined, '-fuel'), 'Diesel'],
        [uniqid(undefined, '-fuel'), 'Ethanol'],
        [uniqid(undefined, '-fuel'), 'Eletricidade'],
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
    fetchFuelById,
    fetchFuelByName,
    fetchFuels,
    initializeFuelModel,
};