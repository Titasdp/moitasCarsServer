const carStanderModal = require("../Models/car_model_model")
const sequelize = require("../Database/connection")
const uniqid = require('uniqid');

getModels = (req, callback) => {
    sequelize
        .query("SELECT * FROM model", {
            model: carStanderModal.CarModel
        })
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(false, error)
        });
};
addModel = (req, callback) => {
    sequelize
        .query(
            "INSERT INTO model (id_model, designation, id_brand) VALUES (:stander);", {
                replacements: {
                    stander: [
                        req.sanitize(uniqid(undefined, "-model")),
                        req.sanitize(req.body.designation),
                        req.sanitize(req.body.id_model),
                    ]
                }
            }, {
                model: carStanderModal.CarModel
            }
        )
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(false, data)
        });
};
updateModel = (req, callback) => {
    sequelize
        .query(
            "UPDATE model SET designation = :designation, id_brand=:id_brand Where model.id_model = :id_model;", {
                replacements: {
                    id_model: req.sanitize(req.params.id_model),
                    designation: req.sanitize(req.params.designation),
                    id_brand: req.sanitize(req.params.id_brand)
                }
            }, {
                model: carStanderModal.CarModel
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
    getModels,
    addModel,
    updateModel,
};