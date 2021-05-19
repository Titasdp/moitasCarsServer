const carModel = require("../Models/car_model")
const sequelize = require("../Database/connection")

const fileManager = require("../Middleware/fileUpload")
const uniqid = require('uniqid');

//*competed
fetchCarsImgByPath = async (dataObj, callback) => {
    let carArray = []
    let canReturn = 0;
    carArray = dataObj.cars
    let processResp = {}
    console.log(dataObj.cars.length);


    for (let i = 0; i < dataObj.cars.length; i++) {

        fileManager.fileGetter({
            path: dataObj.cars[i].image
        }, async (fetchSuccess, fetchResult) => {
            console.log(i);

            let response = await fetchResult

            if (!fetchSuccess) {
                return callback(true, fetchResult)
            }
            dataObj.cars[i].image = fetchResult.toClient.processResult

            canReturn++


            if (canReturn === dataObj.cars.length) {
                console.log(dataObj.cars);
                processResp = {
                    processRespCode: 200,
                    toClient: {
                        processResult: dataObj.cars,
                        processError: null,
                        processMsg: "The file was successfully fetched.",
                    }
                }
                return callback(true, processResp)
            }
        })

    }
}
//*completed
fetchCars = (dataObj, callback) => {

    let processResp = {}
    let query = `SELECT car.reg_plate, car.description, car.img_url as image, car.price, car.mileage, car.top_speed, car.production_date, car.facebook_url, car.custoJusto_url, fuel.designation as fuel, engine.designation as engine, engine.horse_power as engine_horse_Power, model.designation as model_name, brand.designation as brand_name FROM(((( car inner Join 
        fuel on car.id_fuel_type= fuel.id_fuel_type)
        Inner Join
        engine on car.id_engine_type= engine.id_engine)
        Inner Join
        model on model.id_model= car.id_model) Inner Join
        brand on model.id_brand= brand.id_brand)`

    if (!dataObj.isAdmin) {
        query = `SELECT car.id_car, car.reg_plate, car.description, car.img_url as image, car.price, car.mileage, car.top_speed, car.production_date, car.facebook_url, car.custoJusto_url, fuel.designation as fuel, engine.designation as engine, engine.horse_power as engine_horse_Power, model.designation as model_name, brand.designation as brand_name FROM(((( car inner Join 
                fuel on car.id_fuel_type= fuel.id_fuel_type)
                Inner Join
                engine on car.id_engine_type= engine.id_engine)
                Inner Join
                model on model.id_model= car.id_model) Inner Join
                brand on model.id_brand= brand.id_brand)`
    }


    sequelize
        .query(query, {
            model: carModel.Car
        })
        .then(data => {
            let returnCarArray = []

            let respCode = 204
            let respMsg = "Fetch process completed successfully, but there is no content."
            if (data.length > 0) {
                respCode = 200
                respMsg = "Data fetched successfully."

                for (const obj of data) {
                    returnCarArray.push(obj.dataValues)
                }
            }

            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: returnCarArray.length > 0 ? returnCarArray : null,
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


//!Sus
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

//*Completed
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
                            dataObj.publisherId,
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


//*Completed
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



//*Completed
//confirmExistence function backup
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


//*Completed
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
            return callback(false, processResp)
        });


}

//*Completed
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
                    return callback(false, processResp)
                });


        })
    })










}

// *Completed
deleteCar = (dataObj, callback) => {
    let processResp = {}

    if (dataObj.req.body.imgPath === null) {
        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something is missing in the request that has been send.",
            }
        }
        return callback(false, processResp)
    }

    sequelize
        .query(
            `DELETE  FROM car  WHERE id_car = :id_car`, {
                replacements: {
                    id_car: dataObj.req.sanitize(dataObj.req.params.id),
                }
            }, {
                model: carModel.Car
            }
        )
        .then(data => {
            fileManager.fileExtermination({
                path: dataObj.req.body.imgPath
            }, async (deleteSuccess, deleteResult) => {

                let msg = "The car was successfully deleted"
                if (!deleteSuccess) {
                    msg = "The car was successfully deleted, but his img is still in the system please contact an developer for aid on removing it."
                }
                processResp = {
                    processRespCode: 200,
                    toClient: {
                        processResult: data,
                        processError: null,
                        processMsg: msg,
                    }
                }
                return callback(true, processResp)
            })
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

/**
 * Supports to other controllers
 * 
 * 
 */

// *Completed
fetchCarByFuelId = (id, callback) => {
    let processResp = {}
    sequelize
        .query("SELECT * FROM car where id_fuel_type =:id_fuel_type", {
            replacements: {
                id_fuel_type: id
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



// *Completed
fetchCarByEngineId = (id, callback) => {
    let processResp = {}
    sequelize
        .query("SELECT * FROM car where id_engine_type =:id_engine_type", {
            replacements: {
                id_engine_type: id
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



// *Completed
fetchCarByModelId = (id, callback) => {
    let processResp = {}
    sequelize
        .query("SELECT * FROM car where id_model =:id_model", {
            replacements: {
                id_model: id
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
    fetchCarsImgByPath,
    fetchCars,
    addCar,
    confirmExistence,
    updateCar,
    updateCarPicture,
    deleteCar,
    fetchCarByFuelId,
    fetchCarByEngineId,
    fetchCarByModelId
};