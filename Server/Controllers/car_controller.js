const carModel = require("../Models/car_model")
const sequelize = require("../Database/connection")
const fuelModel = require("../Models/fuel_model")
const engineModel = require("../Models/engine_model")
const carModelModel = require("../Models/car_model_model")
const brandModel = require("../Models/brand_model")
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


addCar = (dataObj, callback) => {

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
            "INSERT INTO car (id_car, reg_plate, description, img_url, price, mileage, top_speed, production_date, facebook_url, custoJusto_url, id_fuel_type, id_engine_type, id_model) VALUES (:newCar);", {
                replacements: {
                    newCar: [
                        uniqid(undefined, "-car"),
                        dataObj.reg_plate,
                        dataObj.description,
                        dataObj.imgPath,
                        dataObj.price,
                        dataObj.mileage,
                        dataObj.top_speed,
                        dataObj.production_date,
                        dataObj.facebook_url,
                        dataObj.custoJustoUrl,
                        dataObj.publisher_id,
                        dataObj.id_fuel_type,
                        dataObj.carModel,
                        dataObj.id_model,
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
};








module.exports = {
    clientGetCars,
    addCar
};