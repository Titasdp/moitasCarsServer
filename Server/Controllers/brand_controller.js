const brandModel = require("../Models/brand_model")
const sequelize = require("../Database/connection")
const uniqid = require('uniqid');

fetchBrands = (req, callback) => {
    let processResp = {}
    sequelize
        .query("SELECT * FROM brand", {
            model: brandModel.Brand
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
fetchBrandByName = (designation, callback) => {
    console.log("designation " + designation);
    let processResp = {}
    sequelize
        .query("SELECT * FROM brand where designation =:desc", {
            replacements: {
                desc: designation
            }
        }, {
            model: brandModel.Brand
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
addBrand = (dataObj, callback) => {
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
            "INSERT INTO brand (id_brand, designation) VALUES (:brand);", {
                replacements: {
                    brand: [
                        uniqid(undefined, "-brand"),
                        dataObj.newDesignation,
                    ]
                }
            }, {
                model: brandModel.Brand
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "A new brand was been created successfully.",
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

// *Completed
updateBrand = (dataObj, callback) => {
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
            "UPDATE brand SET designation = :designation Where brand.id_brand = :id_brand;", {
                replacements: {
                    id_brand: dataObj.brandId,
                    designation: dataObj.newDesignation,
                }
            }, {
                model: brandModel.Brand
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data,
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

// *Completed
initializeBrandModel = async (dataObj, callback) => {
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
        [uniqid(undefined, "-brand"), 'Indefinido'],
        [uniqid(undefined, "-brand"), 'Tesla'],
        [uniqid(undefined, "-brand"), 'BMW'],
        [uniqid(undefined, "-brand"), 'Ferrari'],
        [uniqid(undefined, "-brand"), 'Ford'],
        [uniqid(undefined, "-brand"), 'Porsche'],
        [uniqid(undefined, "-brand"), 'Honda'],
        [uniqid(undefined, "-brand"), 'Lamborghini'],
        [uniqid(undefined, "-brand"), 'Toyota'],
        [uniqid(undefined, "-brand"), 'Bentley'],
        [uniqid(undefined, "-brand"), 'Maserati'],
        [uniqid(undefined, "-brand"), 'Audi'],
        [uniqid(undefined, "-brand"), 'Jeep'],
        [uniqid(undefined, "-brand"), 'Subaru'],
        [uniqid(undefined, "-brand"), 'Chrysler'],
        [uniqid(undefined, "-brand"), 'Chevrolet Corvette'],
        [uniqid(undefined, "-brand"), 'Dodge'],
        [uniqid(undefined, "-brand"), 'Hyundai'],
        [uniqid(undefined, "-brand"), 'Jaguar'],
        [uniqid(undefined, "-brand"), 'Mazda'],
        [uniqid(undefined, "-brand"), 'Ford Mustang'],
        [uniqid(undefined, "-brand"), 'Nissan'],
        [uniqid(undefined, "-brand"), 'Alfa Romeo'],
        [uniqid(undefined, "-brand"), 'Bugatti'],
        [uniqid(undefined, "-brand"), 'Buick'],
        [uniqid(undefined, "-brand"), 'Lexus'],
        [uniqid(undefined, "-brand"), 'Roll-Royce'],
        [uniqid(undefined, "-brand"), 'Acura'],
        [uniqid(undefined, "-brand"), 'Aston Martin'],
        [uniqid(undefined, "-brand"), 'Chevrolet'],
        [uniqid(undefined, "-brand"), 'Kia'],
        [uniqid(undefined, "-brand"), 'Mercedes-Benz'],
        [uniqid(undefined, "-brand"), 'Volkswagen'],
        [uniqid(undefined, "-brand"), 'Volvo'],
        [uniqid(undefined, "-brand"), 'McLaren'],
        [uniqid(undefined, "-brand"), 'Mitsubishi'],
        [uniqid(undefined, "-brand"), 'GMC'],
        [uniqid(undefined, "-brand"), 'Infiniti'],
        [uniqid(undefined, "-brand"), 'Lincoln'],
        [uniqid(undefined, "-brand"), 'Peugeot'],
        [uniqid(undefined, "-brand"), 'Pontiac'],
        [uniqid(undefined, "-brand"), 'Saab'],
        [uniqid(undefined, "-brand"), 'Genesis'],
        [uniqid(undefined, "-brand"), 'Suzuki'],
        [uniqid(undefined, "-brand"), 'Citroën'],
        [uniqid(undefined, "-brand"), 'Fiat'],
        [uniqid(undefined, "-brand"), 'Lotus'],
        [uniqid(undefined, "-brand"), 'Mini'],
    ]
    await sequelize
        .query(
            `INSERT INTO brand (id_brand,designation) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: brandModel.Brand
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
            return callback(true, processResp)
        })
        .catch(error => {
            console.log(error);
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



//*Completed
deleteBrand = (dataObj, callback) => {
    let processResp = {}
    if (!dataObj.canContinue) {
        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There is still cars associated to this type of engine.",
            }
        }

    }

    sequelize
        .query(
            `DELETE  FROM brand  WHERE id_brand = :id_brand`, {
                replacements: {
                    id_brand: dataObj.req.sanitize(dataObj.req.params.id),
                }
            }, {
                model: brandModel.Brand
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "The engine was successfully deleted, but his img is still in the system please contact an developer for aid on removing it.",
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
            return callback(false, processResp)
        });
}

module.exports = {
    updateBrand,
    fetchBrands,
    addBrand,
    initializeBrandModel,
    fetchBrandByName,
    deleteBrand
};