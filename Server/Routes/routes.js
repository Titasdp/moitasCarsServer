const express = require("express");
const router = express.Router(); // router
const carController = require("../Controllers/car_controller")
const brandController = require("../Controllers/brand_controller")
const userController = require("../Controllers/user_controller")



router.get("/cars", (req, res) => {
    carController.clientGetCars(req, res);
});

//<Brand routes
router.get("/brands", (req, res) => {
    userController.getUserB(req, (success, result) => {

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
            res.status(201).send({
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
            res.status(200).send({
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

// !
//<User routes
router.post("/login", (req, res) => {
    userController.getUserByName(req, (success, result) => {
        if (success) {
            userController.userLogin({
                userData: result[0],
                password: req.sanitize(req.body.password),
            }, (upDateSuccess, returnedObj) => {
                if (upDateSuccess == true) {
                    res.status(returnedObj.respCode).send({
                        message: returnedObj.msg,
                        error: returnedObj.error,
                        token: returnedObj.token,
                        username: returnedObj.username,
                    });
                } else {
                    res.status(returnedObj.respCode).send({
                        message: returnedObj.msg,
                        error: returnedObj.error,
                        token: returnedObj.token,
                        username: returnedObj.username,
                    });
                }
            });
        } else {
            res.status(400).send({
                data: null,
                message: "The username and password you entered did not match our records.",
                error: result,
            });
        }
    });
});

router.patch("/users/:id_user/password", (req, res) => {
    userController.getUserById(req, (success, result) => {
        //secondPart
        if (success) {
            userController.updateUserPassword({
                userData: result[0][0],
                oldPassword: req.sanitize(req.body.oldPassword),
                newPassword: req.sanitize(req.body.newPassword)
            }, (upDateSuccess, returnedObj) => {
                if (upDateSuccess == true) {
                    res.status(returnedObj.respCode).send({
                        data: returnedObj.data,
                        message: returnedObj.msg,
                        error: null
                    });
                } else {
                    res.status(returnedObj.respCode).send({
                        data: null,
                        message: returnedObj.msg,
                        error: returnedObj.error,
                    });
                }
            });
        } else {
            res.status(204).send({
                data: null,
                message: "Something went wrong please try again later",
                error: result,
            });
        }
    });
});
router.post("/users", (req, res) => {
    userController.addUser(req, (success, result) => {
        if (success == true) {
            res.status(201).send({
                data: result.returnData,
                message: result.msg,
                error: null,
                generatedPassword: result.generatedPassword
            });
        } else {
            res.status(400).send({
                data: null,
                message: result.msg,
                error: result.error,
            });
        }
    });
});
router.post("/users", (req, res) => {
    userController.addUser(req, (success, result) => {
        if (success == true) {
            res.status(201).send({
                data: result.returnData,
                message: result.msg,
                error: null,
                generatedPassword: result.generatedPassword
            });
        } else {
            res.status(400).send({
                data: null,
                message: result.msg,
                error: result.error,
            });
        }
    });
});









//user routes>



module.exports = router;