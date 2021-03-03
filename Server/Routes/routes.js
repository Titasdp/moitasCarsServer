const express = require("express");
const router = express.Router(); // router
const carController = require("../Controllers/car_controller")
const brandController = require("../Controllers/brand_controller")


router.get("/cars", (req, res) => {
    carController.clientGetCars(req, res);
});

//*Brand routes
router.get("/brands", (req, res) => {
    brandController.getBrands(req, res);
});
router.post("/brands", (req, res) => {
    brandController.addBrand(req, res);
});
//*



module.exports = router;