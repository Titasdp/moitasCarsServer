const carModel = require("../Models/car_model")
const sequelize = require("../Database/connection")
const uniqid = require('uniqid');

clientGetCars = (req, res) => {
    sequelize
        .query("SELECT * FROM car", {
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


module.exports = {
    clientGetCars
};