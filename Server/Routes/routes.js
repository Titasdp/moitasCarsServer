const express = require("express");
const router = express.Router(); // router
const carController = require("../Controllers/car_controller")
//<Init
const brandController = require("../Controllers/brand_controller")
const fuelController = require("../Controllers/fuel_controller")
const engineController = require("../Controllers/engine_controller")
//Init>
const userController = require("../Controllers/user_controller")

//Initialize
router.post("/init", async (req, res) => {
    let processResp = {} // return array
    let successInitArray = []
    let existArray = []
    await brandController.getBrandByName("Indefinido", (success, result) => {
        if (success) {
            console.log(result.length);
            if (result.length === 0) {
                brandController.initializeBrandModel((initSuccess, result) => {
                    if (initSuccess) {
                        successInitArray.push(initSuccess)
                    }
                });
            } else {
                existArray.push(success)
            }
        }
    })
    // await fuelController.getFuelByName("Indefinido", async (success, result) => {
    //     if (success) {
    //         if (result[0].length === 0) {
    //             await fuelController.initializeFuelModel((initSuccess, result) => {
    //                 if (initSuccess) {
    //                     successInitArray.push(initSuccess)
    //                 }
    //             });
    //         } else {
    //             existArray.push(success)
    //         }
    //     }
    // })
    // await engineController.getEngineByName("Indefinido", async (success, result) => {
    //     if (success) {
    //         if (result[0].length === 0) {
    //             await engineController.initializeEngineModel((initSuccess, result) => {
    //                 if (initSuccess) {
    //                     successInitArray.push(initSuccess)
    //                 }
    //             });
    //         } else {
    //             existArray.push(success)
    //         }
    //     }
    // });
    console.log(existArray.length + "li");
    if (successInitArray.length === 1 && existArray.length === 0) {
        processResp = {
            processRespCode: 201,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "All data Created successfully.",
            }
        }

    } else if (successInitArray.length === 0 && existArray.length === 1) {
        processResp = {
            processRespCode: 200,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "This function can only be called one time after his success",
            }
        }
    } else {
        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Not all data where insert in to the table, something went wrong please try again later.",
            }
        }
    }
    res.status(processResp.processRespCode).send(processResp.toClient)
})

























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