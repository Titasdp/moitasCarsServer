const brandModel = require("../Models/brand_model")
const sequelize = require("../Database/connection")
const uniqid = require('uniqid');
const Sequelize = require("sequelize");

getBrands = (req, callback) => {
    sequelize
        .query("SELECT * FROM brand", {
            model: brandModel.Brand
        })
        .then(data => {
            return callback(true, data)
        })
        .catch(error => {
            return callback(false, error)
        });
};
addBrand = (req, callback) => {
    sequelize
        .query(
            "INSERT INTO brand (id_brand, designation) VALUES (:brand);", {
                replacements: {
                    brand: [
                        req.sanitize(uniqid(undefined, "-brand")),
                        req.sanitize(req.body.designation),
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

updateBrand = (req, callback) => {
    sequelize
        .query(
            "UPDATE brand SET designation = :designation Where brand.id_brand = :id_brand;", {
                replacements: {
                    id_brand: req.sanitize(req.params.id_brand),
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
    updateBrand,
    getBrands,
    addBrand
};