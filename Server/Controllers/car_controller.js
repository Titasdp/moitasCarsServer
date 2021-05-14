const carModel = require("../Models/car_model")
const sequelize = require("../Database/connection")
// const fuelModel = require("../Models/fuel_model")
// const engineModel = require("../Models/engine_model")
// const carModelModel = require("../Models/car_model_model")
// const brandModel = require("../Models/brand_model")

const fileManager = require("../Middleware/fileUpload")
const uniqid = require('uniqid');

clientGetCars = (req, res) => {
    sequelize
        .query(` SELECT car.id_car, car.reg_plate, car.description, car.img_url, car.price, car.mileage, car.top_speed, car.production_date, car.facebook_url, car.custoJusto_url, fuel.designation, engine.designation, engine.horse_power, model.designation as model_name, brand.designation as brand_name FROM(((( car inner Join 
            fuel on car.id_fuel_type= fuel.id_fuel_type)
       Inner Join
      engine on car.id_engine_type= car.id_engine_type)
       Inner Join
      model on model.id_model= car.id_model) Inner Join
      brand on model.id_brand= brand.id_brand)
    ;`, {
            model: carModel.Car
        })
        .then(data => {
            res.status(200).json({
                data: data,
                message: "Request done Successfully",
                error: null,
            });
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({
                data: null,
                message: "Something went wrong please try again later",
                error: error,
            });
        });
};



clientGetCars = (req, res) => {
    sequelize
        .query(` SELECT car.id_car, car.reg_plate, car.description, car.img_url, car.price, car.mileage, car.top_speed, car.production_date, car.facebook_url, car.custoJusto_url, fuel.designation, engine.designation, engine.horse_power, model.designation as model_name, brand.designation as brand_name FROM(((( car inner Join 
            fuel on car.id_fuel_type= fuel.id_fuel_type)
       Inner Join
      engine on car.id_engine_type= car.id_engine_type)
       Inner Join
      model on model.id_model= car.id_model) Inner Join
      brand on model.id_brand= brand.id_brand)
    ;`, {
            model: carModel.Car
        })
        .then(data => {
            res.status(200).json({
                data: data,
                message: "Request done Successfully",
                error: null,
            });
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({
                data: null,
                message: "Something went wrong please try again later",
                error: error,
            });
        });
};


addCar = async (dataObj, callback) => {

    let processResp = {}

    fileManager.fileUpload({
        req: dataObj.req
    }, (uploadSuccess, uploadResult) => {
        if (uploadSuccess) {
            sequelize
                .query(
                    "INSERT INTO car (id_car, reg_plate, description, img_url, price, mileage, top_speed, production_date, facebook_url, custoJusto_url, id_fuel_type, id_engine_type, id_model) VALUES (:newCar);", {
                        replacements: {
                            newCar: [
                                uniqid(undefined, "-car"),
                                dataObj.req.sanitize(dataObj.req.body.regPlate),
                                dataObj.req.sanitize(dataObj.req.body.description),
                                uploadResult.toClient.processResult,
                                dataObj.req.sanitize(dataObj.req.body.price),
                                dataObj.req.sanitize(dataObj.req.body.mileage),
                                dataObj.req.sanitize(dataObj.req.body.topSpeed),
                                dataObj.req.sanitize(dataObj.req.body.productionDate),
                                dataObj.req.sanitize(dataObj.req.body.facebookUrl),
                                dataObj.req.sanitize(dataObj.req.body.custoJustoUrl),
                                dataObj.req.sanitize(dataObj.req.body.publisherId),
                                dataObj.req.sanitize(dataObj.req.body.idFuelType),
                                dataObj.req.sanitize(dataObj.req.body.idFuelType),
                                dataObj.req.sanitize(dataObj.req.body.idModel),
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
                            processMsg: "A new car has been created successfully.",
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
        }

        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: error,
                processMsg: "Something went wrong please try again later.",
            }
        }
        return callback(false, uploadResult)
    })






};



confirmExistence = async (dataObj, callback) => {
    let processResp = {}
    let arrayOfColumn = ['reg_plate', 'facebook_url', 'custoJusto_url']
    let responses = ['There is already a car with that registration plate.', 'There is already a car that redirects to that facebook page.', 'There is already a car that redirects to that Custo Justo page.']
    let arrayOfData = [dataObj.regPlate, dataObj.facebookUrl, dataObj.custoJustoUrl]

    console.log(arrayOfData);
    for (let i = 0; i < 3; i++) {
        console.log(i);
        confirmCarExistentByParams({
            selectedField: arrayOfColumn[i],
            substitute: arrayOfData[i],
        }, (success, result) => {
            if (!success) {
                processResp = {
                    processRespCode: respCode,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "Something went wrong please try again later.",
                    }
                }
                return callback(false, processResp)
            }

            if (success && result.processRespCode !== 204) {
                processResp = {
                    processRespCode: 400,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: responses[i],
                    }
                }
                return callback(false, processResp)
            }


            if (i === 2) {

                return callback(true, processResp)
            }
        })
    }



}




confirmCarExistentByParams = (dataObj, callback) => {
    let processResp = {}

    let query = `select * from  car where ${dataObj.selectedField} =:substitute`
    sequelize
        .query(query, {
            replacements: {
                substitute: dataObj.substitute
            }

        }, {
            model: carModel.Car
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








module.exports = {
    clientGetCars,
    addCar,
    confirmExistence
};