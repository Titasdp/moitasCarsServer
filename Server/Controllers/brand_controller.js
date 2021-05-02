const brandModel = require("../Models/brand_model")
const sequelize = require("../Database/connection")
const uniqid = require('uniqid');

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
getBrandByName = (designation, callback) => {
    sequelize
        .query("SELECT * FROM brand where designation =:desc", {
            replacements: {
                desc: designation
            }
        }, {
            model: brandModel.Brand
        })
        .then(data => {
            return callback(true, data[0])
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


initializeBrandModel = async (callback) => {
    console.log("here2");
    let insertArray = [
        [uniqid(undefined, "-brand"), 'Indefinido'],
        [uniqid(undefined, "-brand"), 'Tesla'],
        [uniqid(undefined, "-brand"), 'BMW'],
        [uniqid(undefined, "-brand"), 'Ferrari'],
        [uniqid(undefined, "-brand"), 'Ford'],
        [uniqid(undefined, "-brand"), 'Porsche'],
        [uniqid(undefined, "-brand"), 'Honda'],
        [uniqid(undefined, "-brand"), 'Lamborghini'],
        [uniqid(undefined, "-brand"), 'Toyota'],
        [uniqid(undefined, "-brand"), 'Bentley'],
        [uniqid(undefined, "-brand"), 'Maserati'],
        [uniqid(undefined, "-brand"), 'Audi'],
        [uniqid(undefined, "-brand"), 'Jeep'],
        [uniqid(undefined, "-brand"), 'Subaru'],
        [uniqid(undefined, "-brand"), 'Chrysler'],
        [uniqid(undefined, "-brand"), 'Chevrolet Corvette'],
        [uniqid(undefined, "-brand"), 'Dodge'],
        [uniqid(undefined, "-brand"), 'Hyundai'],
        [uniqid(undefined, "-brand"), 'Jaguar'],
        [uniqid(undefined, "-brand"), 'Mazda'],
        [uniqid(undefined, "-brand"), 'Ford Mustang'],
        [uniqid(undefined, "-brand"), 'Nissan'],
        [uniqid(undefined, "-brand"), 'Alfa Romeo'],
        [uniqid(undefined, "-brand"), 'Bugatti'],
        [uniqid(undefined, "-brand"), 'Buick'],
        [uniqid(undefined, "-brand"), 'Lexus'],
        [uniqid(undefined, "-brand"), 'Roll-Royce'],
        [uniqid(undefined, "-brand"), 'Acura'],
        [uniqid(undefined, "-brand"), 'Aston Martin'],
        [uniqid(undefined, "-brand"), 'Chevrolet'],
        [uniqid(undefined, "-brand"), 'Kia'],
        [uniqid(undefined, "-brand"), 'Mercedes-Benz'],
        [uniqid(undefined, "-brand"), 'Volkswagen'],
        [uniqid(undefined, "-brand"), 'Volvo'],
        [uniqid(undefined, "-brand"), 'McLaren'],
        [uniqid(undefined, "-brand"), 'Mitsubishi'],
        [uniqid(undefined, "-brand"), 'GMC'],
        [uniqid(undefined, "-brand"), 'Infiniti'],
        [uniqid(undefined, "-brand"), 'Lincoln'],
        [uniqid(undefined, "-brand"), 'Peugeot'],
        [uniqid(undefined, "-brand"), 'Pontiac'],
        [uniqid(undefined, "-brand"), 'Saab'],
        [uniqid(undefined, "-brand"), 'Genesis'],
        [uniqid(undefined, "-brand"), 'Suzuki'],
        [uniqid(undefined, "-brand"), 'Citroën'],
        [uniqid(undefined, "-brand"), 'Fiat'],
        [uniqid(undefined, "-brand"), 'Lotus'],
        [uniqid(undefined, "-brand"), 'Mini'],
    ]
    await sequelize
        .query(
            `INSERT INTO brand (id_brand,designation) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: brandModel.Brand
            }
        )
        .then(data => {
            let processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "Data introduced successfully",
                }
            }
            return callback(false, processResp)
        })
        .catch(error => {
            console.log(error);
            let processResp = {
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


module.exports = {
    updateBrand,
    getBrands,
    addBrand,
    initializeBrandModel,
    getBrandByName,
};