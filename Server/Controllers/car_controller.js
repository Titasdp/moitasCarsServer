const carModel = require("../Models/car_model")
const sequelize = require("../Database/connection")
// const fuelModel = require("../Models/fuel_model")
// const engineModel = require("../Models/engine_model")
// const carModelModel = require("../Models/car_model_model")
// const brandModel = require("../Models/brand_model")

const fileManager = require("../Middleware/fileUpload")
const uniqid = require('uniqid');


fetchCarsImgByPath = async (dataObj, callback) => {

    let processResp = {}
    for (const car of dataObj.cars) {
        await fileManager.fileGetter({
            path: car.image
        }, (fetchSuccess, fetchResult) => {

            if (!fetchSuccess) {
                return callback(false, fetchResult)
            }
            car.image = fetchResult.toClient.processResult
        })
    }


    processResp = {
        processRespCode: 200,
        toClient: {
            processResult: dataObj.cars,
            processError: error,
            processMsg: "Something went wrong please try again later.",
        }
    }
    return callback(false, processResp)
}






fetchCars = (dataObj, callback) => {
    let query = ``
    if (!dataObj.isAdmin) {
        query = `SELECT car.id_car, car.reg_plate, car.description, car.img_url as image, car.price, car.mileage, car.top_speed, car.production_date, car.facebook_url, car.custoJusto_url, fuel.designation as fuel, engine.designation as engine, engine.horse_power as engine_horse_Power, model.designation as model_name, brand.designation as brand_name FROM(((( car inner Join 
                fuel on car.id_fuel_type= fuel.id_fuel_type)
                Inner Join
                engine on car.id_engine_type= engine.id_engine)
                Inner Join
                model on model.id_model= car.id_model) Inner Join
                brand on model.id_brand= brand.id_brand)`
    }

    // where car.id_car =0;
    sequelize
        .query(query, {
            model: carModel.Car
        })
        .then(data => {
            let returnCarArray = []
            console.log(data[0].dataValues);




            let respCode = 200
            let respMsg = "Data fetched successfully."
            if (data.length === 0) {
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

            // return callback(true, processResp)
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
    console.log("addCarStart");
    let processResp = {}

    await fileManager.fileUpload({
        req: dataObj.req
    }, (uploadSuccess, uploadResult) => {

        if (!uploadSuccess) {
            return callback(false, uploadResult)
        }

        sequelize
            .query(
                "INSERT INTO car (id_car, reg_plate, description, img_url, price, mileage, top_speed, production_date, facebook_url, custoJusto_url, publisher_id, id_fuel_type, id_engine_type, id_model) VALUES (:newCar);", {
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
                            dataObj.req.sanitize(dataObj.req.body.idEngineType),
                            dataObj.req.sanitize(dataObj.req.body.idModel),
                        ]
                    }
                }, {
                    model: carModel.Car
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
    })

};



confirmExistence = async (dataObj, callback) => {
    let processResp = {}
    let arrayOfColumn = ['reg_plate', 'facebook_url', 'custoJusto_url']
    let responses = ['There is already a car with that registration plate.', 'There is already a car that redirects to that facebook page.', 'There is already a car that redirects to that Custo Justo page.']
    let arrayOfData = [dataObj.regPlate, dataObj.facebookUrl, dataObj.custoJustoUrl]

    for (let i = 0; i < 3; i++) {

        await confirmCarExistentByParams({
            selectedField: arrayOfColumn[i],
            substitute: arrayOfData[i],
        }, (success, result) => {
            if (!success) {
                processResp = {
                    processRespCode: result.respCode,
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
                console.log("success");
                processResp = {
                    processRespCode: 200,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "Process procedure can be continue.",
                    }
                }

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



updateCar = (dataObj, callback) => {
    let processResp = {}

    sequelize
        .query(
            "UPDATE car SET reg_plate = :reg_plate, description =:description, price=:price, mileage=:mileage, top_speed=:top_speed, production_date=:production_date , facebook_url=:facebook_url, custoJusto_url=:custoJusto_url, id_fuel_type =:id_fuel_type, id_engine_type=:id_engine_type, id_model =:id_model Where car.id_car = :id_car;", {
                replacements: {
                    reg_plate: dataObj.req.sanitize(dataObj.req.body.regPlate),
                    description: dataObj.req.sanitize(dataObj.req.body.description),
                    price: dataObj.req.sanitize(dataObj.req.body.price),
                    mileage: dataObj.req.sanitize(dataObj.req.body.mileage),
                    top_speed: dataObj.req.sanitize(dataObj.req.body.topSpeed),
                    production_date: dataObj.req.sanitize(dataObj.req.body.productionDate),
                    facebook_url: dataObj.req.sanitize(dataObj.req.body.facebookUrl),
                    custoJusto_url: dataObj.req.sanitize(dataObj.req.body.custoJustoUrl),
                    id_fuel_type: dataObj.req.sanitize(dataObj.req.body.idFuelType),
                    id_engine_type: dataObj.req.sanitize(dataObj.req.body.idEngineType),
                    id_model: dataObj.req.sanitize(dataObj.req.body.idModel),
                    id_car: dataObj.req.sanitize(dataObj.req.params.id),
                }
            }, {
                model: carModel.Car
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "The car was updated successfully.",
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


}

updateCarPicture = async (dataObj, callback) => {
    let processResp = {}

    fileManager.fileDelete({
        req: dataObj.req
    }, async (deleteSuccess, deleteResult) => {
        if (!deleteSuccess) {
            return callback(false, deleteResult)
        }
        await fileManager.fileUpload({
            req: dataObj.req
        }, (uploadSuccess, uploadResult) => {

            if (!uploadSuccess) {
                return callback(false, uploadResult)
            }

            sequelize
                .query(
                    "UPDATE car SET img_url = :img_url Where car.id_car = :id_car;", {
                        replacements: {
                            img_url: uploadResult.toClient.processResult,
                            id_car: dataObj.req.sanitize(dataObj.req.params.id),
                        }
                    }, {
                        model: carModel.Car
                    }
                )
                .then(data => {
                    processResp = {
                        processRespCode: 200,
                        toClient: {
                            processResult: data[0],
                            processError: null,
                            processMsg: "The car image was updated successfully.",
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


        })
    })










}







module.exports = {
    fetchCarsImgByPath,
    fetchCars,
    addCar,
    confirmExistence,
    updateCar,
    updateCarPicture
};