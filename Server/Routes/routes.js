const express = require("express");
const router = express.Router(); // router
const carController = require("../Controllers/car_controller")
const brandController = require("../Controllers/brand_controller")


router.get("/cars", (req, res) => {
    carController.clientGetCars(req, res);
});

//<Brand routes
router.get("/brands", (req, res) => {
    brandController.getBrands(req, (success, result) => {
        if (success == true) {
            res.status(200).json({
                data: result,
                message: "The request was an success",
                error: null,
            });
        } else {
            res.status(500).send({
                data: null,
                message: "Something went wrong please try again later",
                error: result,
            });
        }
    });
});
// *Add Brand
router.post("/brands", (req, res) => {
    brandController.getBrands(req, (success, result) => {
        if (success == true) {
            res.status(201).json({
                data: data[0],
                message: "Brand created with success",
                error: null,
            });
        } else {
            res.status(400).send({
                data: null,
                message: "Something went wrong please try again later",
                error: result,
            });
        }
    });
    brandController.addBrand(req, res);
});
//*Update brand
router.patch("/brands", (req, res) => {
    brandController.updateBrandDesign(req, (success, result) => {
        if (success == true) {
            res.status(200).json({
                data: result,
                message: "The data was updated with successfully",
                error: null,
            });
        } else {
            res.status(400).send({
                data: null,
                message: "Something went wrong please try again later",
                error: result,
            });
        }
    });
});
//>


//<Model routes
router.get("/brands", (req, res) => {
    brandController.getBrands(req, (success, result) => {
        if (success == true) {
            res.status(200).json({
                data: result,
                message: "The request was an success",
                error: null,
            });
        } else {
            res.status(500).send({
                data: null,
                message: "Something went wrong please try again later",
                error: result,
            });
        }
    });
});
// *Add Brand
router.post("/brands", (req, res) => {
    brandController.getBrands(req, (success, result) => {
        if (success == true) {
            res.status(201).json({
                data: data[0],
                message: "Brand created with success",
                error: null,
            });
        } else {
            res.status(400).send({
                data: null,
                message: "Something went wrong please try again later",
                error: result,
            });
        }
    });
    brandController.addBrand(req, res);
});
//*Update brand
router.patch("/brands", (req, res) => {
    brandController.updateBrandDesign(req, (success, result) => {
        if (success == true) {
            res.status(200).json({
                data: result,
                message: "The data was updated with successfully",
                error: null,
            });
        } else {
            res.status(400).send({
                data: null,
                message: "Something went wrong please try again later",
                error: result,
            });
        }
    });
});
//>



module.exports = router;