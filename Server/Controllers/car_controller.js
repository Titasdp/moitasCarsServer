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


addCar = (req, callback) => {
    sequelize
        .query(
            "INSERT INTO car (id_car, reg_plate, description, img_url, price, mileage, top_speed, production_date, facebook_url, custoJusto_url, id_fuel_type, id_engine_type, id_model) VALUES (:newCar);", {
                replacements: {
                    newCar: [
                        req.sanitize(uniqid(undefined, "-car")),
                        req.sanitize(req.body.reg_plate),
                        req.sanitize(req.body.description),
                        req.sanitize(req.body.img_url),
                        req.sanitize(req.body.price),
                        req.sanitize(req.body.mileage),
                        req.sanitize(req.body.top_speed),
                        req.sanitize(req.body.production_date),
                        req.sanitize(req.body.facebook_url),
                        req.sanitize(req.body.custoJusto_url),
                        req.sanitize(req.body.publisher_id),
                        req.sanitize(req.body.id_fuel_type),
                        req.sanitize(req.body.carModel),
                        req.sanitize(req.body.id_model),
                    ]
                }
            }, {
                model: brandModel.Brand
            }
        )
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(false, error)
        });
};








module.exports = {
    clientGetCars
};