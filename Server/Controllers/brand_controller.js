const brandModel = require("../Models/brand_model")
const sequelize = require("../Database/connection")
const uniqid = require('uniqid');
const Sequelize = require("sequelize");

getBrands = (req, res) => {
    sequelize
        .query("SELECT * FROM brand", {
            model: brandModel.Brand
        })
        .then(data => {
            res.status(200).json({
                data: data,
                message: "The request was an success",
                error: null,
            });
        })
        .catch(error => {
            res.status(400).send({
                data: null,
                message: "Something went wrong please try again later",
                error: error,
            });
        });
};

addBrand = (req, res) => {
    sequelize
        .query(
            "INSERT INTO brand (id_brand, designation) VALUES (:car);", {
                replacements: {
                    car: [
                        req.sanitize(uniqid(undefined, "-brand")),
                        req.sanitize(req.body.designation),
                    ]
                }
            }, {
                model: brandModel.Brand
            }
        )
        .then(data => {
            res.status(201).json({
                data: data[0],
                message: "Brand created with success",
                error: null,
            });
            res.status(201).json(data[0]);
        })
        .catch(error => {
            res.status(400).send({
                data: null,
                message: "Something went wrong please try again later",
                error: error,
            });
        });
};

module.exports = {
    getBrands,
    addBrand
};