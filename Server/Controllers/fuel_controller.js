const fuelTypeModel = require("../Models/fuel_model")
const sequelize = require("../Database/connection")
const uniqid = require('uniqid');

getFuels = (req, callback) => {
    sequelize
        .query("SELECT * FROM fuel", {
            model: fuelTypeModel.Fuel
        })
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(false, error)
        });
};
addFuel = (req, callback) => {
    sequelize
        .query(
            "INSERT INTO fuel (id_fuel_type, designation) VALUES (:fuelType);", {
                replacements: {
                    fuelType: [
                        req.sanitize(uniqid(undefined, "-fuel")),
                        req.sanitize(req.body.designation),
                    ]
                }
            }, {
                model: fuelTypeModel.Fuel
            }
        )
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(false, error)
        });
};

updateFuel = (req, callback) => {
    sequelize
        .query(
            "UPDATE fuel SET designation = :designation Where fuel.id_fuel_type = :id_fuel_type;", {
                replacements: {
                    id_fuel_type: req.sanitize(req.params.id_fuel_type),
                    designation: req.sanitize(req.params.designation)
                }
            }, {
                model: brandModel.Brand
            }
        )
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(true, error)
        });
};

module.exports = {
    updateFuel,
    addFuel,
    getFuels
};