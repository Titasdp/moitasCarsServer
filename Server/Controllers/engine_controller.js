const engineModel = require("../Models/engine_model")
const sequelize = require("../Database/connection")
const uniqid = require('uniqid');

//*Completed
fetchEngines = (req, callback) => {
    let processResp = {}
    sequelize
        .query("SELECT * FROM engine", {
            model: engineModel.Engine
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
fetchEngineById = (id, callback) => {
    let processResp = {}
    sequelize
        .query("SELECT * FROM engine where id_engine =:id_engine", {
            replacements: {
                id_engine: id
            }
        }, {
            model: engineModel.Engine
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

//*Completed
fetchEngineByName = (designation, callback) => {
    let processResp = {}

    sequelize
        .query("SELECT * FROM engine where designation =:desc", {
            replacements: {
                desc: designation
            }
        }, {
            model: engineModel.Engine
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
addEngine = (dataObj, callback) => {

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
            "INSERT INTO engine (id_engine, designation,horse_power) VALUES (:engineType);", {
                replacements: {
                    engineType: [
                        uniqid(undefined, "-engine"),
                        dataObj.newDesignation,
                        dataObj.horsePower,
                    ]
                }
            }, {
                model: engineModel.Engine
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
updateEngine = (dataObj, callback) => {
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
            "UPDATE engine SET designation = :designation , horse_power =:horse_power Where engine.id_engine = :id_engine;", {
                replacements: {
                    id_engine: dataObj.engineId,
                    designation: dataObj.newDesignation,
                    horse_power: dataObj.horsePower
                }
            }, {
                model: engineModel.Engine
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

//*Completed
initializeEngineModel = async (dataObj, callback) => {
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
        [uniqid(undefined, '-engine'), 'Indefinido'],
        [uniqid(undefined, '-engine'), 'V4'],
        [uniqid(undefined, '-engine'), 'V6'],
        [uniqid(undefined, '-engine'), 'V8'],
        [uniqid(undefined, '-engine'), 'V12'],
        [uniqid(undefined, '-engine'), 'V'],
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
                    processMsg: "Data introduced successfully.",
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
    fetchEngines,
    initializeEngineModel,
    fetchEngineByName,
    fetchEngineById
};