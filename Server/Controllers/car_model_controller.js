const carStanderModal = require("../Models/car_model_model")
const sequelize = require("../Database/connection")
const uniqid = require('uniqid');

//*Completed
fetchModels = (req, callback) => {
    sequelize
        .query("SELECT * FROM model", {
            model: carStanderModal.CarModel
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
addModel = (dataObj, callback) => {

    let processResp = {}

    if (dataObj.fetchConfirmExist) {
        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There is already a model with that designation, introduced in the system.",
            }
        }
        return callback(true, processResp)
    }

    sequelize
        .query(
            "INSERT INTO model (id_model, designation, id_brand) VALUES (:stander);", {
                replacements: {
                    stander: [
                        uniqid(undefined, "-model"),
                        dataObj.newDesignation,
                        dataObj.idBrand,
                    ]
                }
            }, {
                model: carStanderModal.CarModel
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "A new car model was been created successfully.",
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
fetchModelByName = (designation, callback) => {
    let processResp = {}

    sequelize
        .query("SELECT * FROM model where designation =:designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: carStanderModal.CarModel
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

//Todo
updateModel = (dataObj, callback) => {
    sequelize
        .query(
            "UPDATE model SET designation = :designation, id_brand=:id_brand Where model.id_model = :id_model;", {
                replacements: {
                    id_model: dataObj.idModel,
                    designation: dataObj.designation,
                    id_brand: dataObj.idBrand,
                }
            }, {
                model: carStanderModal.CarModel
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
module.exports = {
    fetchModels,
    addModel,
    updateModel,
    fetchModelByName,
};