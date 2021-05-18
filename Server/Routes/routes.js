const express = require("express");
const router = express.Router(); // router
const carController = require("../Controllers/car_controller")

//<Middleware
const fileUploader = require("../Middleware/fileUpload")
//Middleware>

//<Init
const brandController = require("../Controllers/brand_controller")
const fuelController = require("../Controllers/fuel_controller")
const engineController = require("../Controllers/engine_controller")
//Init>
const carModelController = require("../Controllers/car_model_controller")
const userController = require("../Controllers/user_controller");
const {
    sync
} = require("read-chunk");

/**
 * Todo: 
 */
//!<Brands
//Initialize
router.post("/init/brands", async (req, res) => {
    let fetchConfirmExist = false
    brandController.fetchBrandByName("Indefinido", (fetchBrandSuccess, fetchBrandResult) => {
        if (fetchBrandSuccess) {
            if (fetchBrandResult.processRespCode === 200) {
                fetchConfirmExist = true
            }
            brandController.initializeBrandModel({
                fetchConfirmExist: fetchConfirmExist
            }, (initSuccess, initBrandResult) => {
                res.status(initBrandResult.processRespCode).send(initBrandResult.toClient)
            });
        } else {
            res.status(fetchBrandResult.processRespCode).send(initBrandResult.toClient)
        }
    })

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
    // console.log(existArray.length + "li");
    // if (successInitArray.length === 1 && existArray.length === 0) {
    //     processResp = {
    //         processRespCode: 201,
    //         toClient: {
    //             processResult: null,
    //             processError: null,
    //             processMsg: "All data Created successfully.",
    //         }
    //     }

    // } else if (successInitArray.length === 0 && existArray.length === 1) {
    //     processResp = {
    //         processRespCode: 200,
    //         toClient: {
    //             processResult: null,
    //             processError: null,
    //             processMsg: "This function can only be called one time after his success",
    //         }
    //     }
    // } else {
    //     processResp = {
    //         processRespCode: 500,
    //         toClient: {
    //             processResult: null,
    //             processError: null,
    //             processMsg: "Not all data where insert in to the table, something went wrong please try again later.",
    //         }
    //     }
    // }
    // res.status(processResp.processRespCode).send(processResp.toClient)
})

//AddBrand
router.post("/brands", async (req, res) => {
    let fetchConfirmExist = false
    brandController.fetchBrandByName(req.sanitize(req.body.designation), (fetchBrandSuccess, fetchBrandResult) => {
        if (fetchBrandSuccess) {
            if (fetchBrandResult.processRespCode === 200) {
                fetchConfirmExist = true
            }
            brandController.addBrand({
                fetchConfirmExist: fetchConfirmExist,
                newDesignation: req.sanitize(req.body.designation)
            }, (addBrandSuccess, addBrandResult) => {
                res.status(addBrandResult.processRespCode).send(addBrandResult.toClient)
            });
        } else {
            res.status(fetchBrandResult.processRespCode).send(fetchBrandResult.toClient)
        }
    })
})

//UpdateBrand
router.patch("/brands/:id/designation", async (req, res) => {
    let fetchConfirmExist = false
    brandController.fetchBrandByName(req.sanitize(req.body.designation), (fetchBrandSuccess, fetchBrandResult) => {
        if (fetchBrandSuccess) {
            if (fetchBrandResult.processRespCode === 200) {
                fetchConfirmExist = true
            }
            brandController.updateBrand({
                fetchConfirmExist: fetchConfirmExist,
                newDesignation: req.sanitize(req.body.designation),
                brandId: req.sanitize(req.params.id),
            }, (updateBrandSuccess, updateBrandResult) => {
                res.status(updateBrandResult.processRespCode).send(updateBrandResult.toClient)
            });
        } else {
            res.status(fetchBrandResult.processRespCode).send(fetchBrandResult.toClient)
        }
    })
})
//!Brands>

//!<Engines
//Initialize
router.post("/init/engines", async (req, res) => {
    let fetchConfirmExist = false
    engineController.fetchEngineByName("Indefinido", (fetchEngineSuccess, fetchEngineResult) => {
        if (fetchEngineSuccess) {
            if (fetchEngineResult.processRespCode === 200) {
                fetchConfirmExist = true
            }
            engineController.initializeEngineModel({
                fetchConfirmExist: fetchConfirmExist
            }, (initSuccess, initEngineResult) => {
                res.status(initEngineResult.processRespCode).send(initEngineResult.toClient)
            });
        } else {
            res.status(fetchEngineResult.processRespCode).send(fetchEngineResult.toClient)
        }
    })

})

//AddBrand
router.post("/engines", async (req, res) => {
    let fetchConfirmExist = false
    engineController.fetchEngineByName(req.sanitize(req.body.designation), (fetchEngineSuccess, fetchEngineResult) => {
        if (fetchEngineSuccess) {
            if (fetchEngineResult.processRespCode === 200) {
                fetchConfirmExist = true
            }
            engineController.addEngine({
                fetchConfirmExist: fetchConfirmExist,
                newDesignation: req.sanitize(req.body.designation),
                horsePower: req.sanitize(req.body.horsePower) ? req.sanitize(req.body.horsePower) : null,
            }, (addEngineSuccess, addEngineResult) => {
                res.status(addEngineResult.processRespCode).send(addEngineResult.toClient)
            });
        } else {
            res.status(fetchEngineResult.processRespCode).send(fetchEngineResult.toClient)
        }
    })
})

//UpdateBrand
router.put("/engines/:id", (req, res) => {

    let fetchConfirmExist = false
    let canBeEdited = true
    engineController.fetchEngineByName(req.sanitize(req.body.designation), (fetchEngineSuccess, fetchEngineResult) => {
        if (fetchEngineSuccess) {
            if (fetchEngineResult.processRespCode === 200) {
                fetchConfirmExist = true
            }
            engineController.fetchEngineById(req.sanitize(req.params.id), (fetchEngineByIdSuccess, fetchEngineByIdResult) => {
                if (fetchEngineByIdSuccess) {
                    if (fetchEngineByIdResult.processRespCode !== 200) {
                        if (fetchEngineByIdResult.toClient.processResult[0].description === "Indefinido") {
                            canBeEdited = false
                        }
                    }
                    engineController.updateEngine({
                        fetchConfirmExist: fetchConfirmExist,
                        canBeEdited: canBeEdited,
                        newDesignation: req.sanitize(req.body.designation),
                        horsePower: req.sanitize(req.body.horsePower) ? req.sanitize(req.body.horsePower) : null,
                        engineId: req.sanitize(req.params.id)
                    }, (updateEngineSuccess, updateEngineResult) => {
                        res.status(updateEngineResult.processRespCode).send(updateEngineResult.toClient)
                    });
                } else {
                    res.status(fetchEngineByIdResult.processRespCode).send(fetchEngineByIdResult.toClient)
                }
            })
        } else {
            res.status(fetchEngineResult.processRespCode).send(fetchEngineResult.toClient)
        }
    })
})
//!Engines>

//!<Fuels
//Initialize
router.post("/init/fuels", async (req, res) => {
    let fetchConfirmExist = false
    fuelController.fetchFuelByName("Indefinido", (fetchFuelSuccess, fetchFuelResult) => {
        if (fetchFuelSuccess) {
            if (fetchFuelResult.processRespCode === 200) {
                fetchConfirmExist = true
            }
            fuelController.initializeFuelModel({
                fetchConfirmExist: fetchConfirmExist
            }, (initSuccess, initFuelResult) => {
                res.status(initFuelResult.processRespCode).send(initFuelResult.toClient)
            });
        } else {
            res.status(fetchFuelResult.processRespCode).send(fetchFuelResult.toClient)
        }
    })

})

//AddBrand
router.post("/fuels", async (req, res) => {
    let fetchConfirmExist = false
    fuelController.fetchEngineByName(req.sanitize(req.body.designation), (fetchFuelSuccess, fetchFuelResult) => {
        if (fetchFuelSuccess) {
            if (fetchFuelResult.processRespCode === 200) {
                fetchConfirmExist = true
            }
            fuelController.addFuel({
                fetchConfirmExist: fetchConfirmExist,
                newDesignation: req.sanitize(req.body.designation),
            }, (addFuelSuccess, addFuelResult) => {
                res.status(addFuelResult.processRespCode).send(addFuelResult.toClient)
            });
        } else {
            res.status(fetchFuelResult.processRespCode).send(fetchFuelResult.toClient)
        }
    })
})

//UpdateBrand
router.patch("/fuel/:id/designation", (req, res) => {
    let fetchConfirmExist = false
    let canBeEdited = true
    fuelController.fetchFuelByName(req.sanitize(req.body.designation), (fetchFuelSuccess, fetchFuelResult) => {
        if (fetchFuelSuccess) {
            if (fetchFuelResult.processRespCode === 200) {
                fetchConfirmExist = true
            }
            fuelController.fetchFuelById(req.sanitize(req.params.id), (fetchFuelByIdSuccess, fetchFuelByIdResult) => {
                if (fetchFuelByIdSuccess) {
                    if (fetchFuelByIdResult.processRespCode !== 200) {
                        if (fetchFuelByIdResult.toClient.processResult[0].description === "Indefinido") {
                            canBeEdited = false
                        }
                    }
                    fuelController.updateFuel({
                        fetchConfirmExist: fetchConfirmExist,
                        canBeEdited: canBeEdited,
                        newDesignation: req.sanitize(req.body.designation),
                        idFuelType: req.sanitize(req.params.id)
                    }, (updateFuelSuccess, updateFuelResult) => {
                        res.status(updateFuelResult.processRespCode).send(updateFuelResult.toClient)
                    });
                } else {
                    res.status(fetchFuelByIdResult.processRespCode).send(fetchFuelByIdResult.toClient)
                }
            })
        } else {
            res.status(fetchFuelResult.processRespCode).send(fetchFuelResult.toClient)
        }
    })
})
//!Fuels>


//!<Models
router.post("/models", async (req, res) => {
    let fetchConfirmExist = false
    carModelController.fetchModelByName(req.sanitize(req.body.designation), (fetchModelSuccess, fetchModelResult) => {
        if (fetchModelSuccess) {
            if (fetchModelResult.processRespCode === 200) {
                fetchConfirmExist = true
            }
            carModelController.addModel({
                fetchConfirmExist: fetchConfirmExist,
                newDesignation: req.sanitize(req.body.designation),
                idBrand: req.sanitize(req.body.idBrand)
            }, (addModelSuccess, addModelResult) => {
                res.status(addModelResult.processRespCode).send(addModelResult.toClient)
            });
        } else {
            res.status(fetchModelResult.processRespCode).send(fetchModelResult.toClient)
        }
    })
})
//!Models>





//!<Cars
router.post("/cars", async (req, res) => {
    if (req.body.regPlate === null, req.body.facebookUrl === null, req.body.idEngineType === null, req.body.idModel === null, req.body.idFuelType === null, req.body.price === null, req.body.description === null) {
        res.status(400).send({
            processResult: null,
            processError: null,
            processMsg: "Please fill in all he required fields.",
        })
    }
    await carController.confirmExistence({
        regPlate: req.sanitize(req.body.regPlate),
        facebookUrl: req.sanitize(req.body.facebookUrl),
        custoJustoUrl: req.sanitize(req.body.custoJustoUrl)
    }, (confirmSuccess, confirmResult) => {
        console.log(confirmSuccess);
        if (!confirmSuccess) {
            res.status(confirmResult.processRespCode).send(confirmResult.toClient)
        }
        carController.addCar({
            req: req
        }, (addSuccess, addResponse) => {
            res.status(addResponse.processRespCode).send(addResponse.toClient)
        })
    })
})


router.put("/cars/:id", async (req, res) => {
    if (req.body.regPlate === null, req.body.facebookUrl === null, req.body.idEngineType === null, req.body.idModel === null, req.body.idFuelType === null, req.body.price === null, req.body.description === null) {
        res.status(400).send({
            processResult: null,
            processError: null,
            processMsg: "Please fill in all he required fields.",
        })
    }
    await carController.confirmExistence({
        regPlate: req.sanitize(req.body.regPlate),
        facebookUrl: req.sanitize(req.body.facebookUrl),
        custoJustoUrl: req.sanitize(req.body.custoJustoUrl)
    }, (confirmSuccess, confirmResult) => {
        if (!confirmSuccess) {
            res.status(confirmResult.processRespCode).send(confirmResult.toClient)
        }
        carController.updateCar({
            req: req
        }, (updateSuccess, updateResponse) => {
            res.status(updateResponse.processRespCode).send(updateResponse.toClient)
        })
    })
})


router.patch("/cars/:id/image", async (req, res) => {
    carController.updateCarPicture({
        req: req
    }, (updateSuccess, updateResponse) => {
        res.status(updateResponse.processRespCode).send(updateResponse.toClient)
    })
})

router.get("/cars", async (req, res) => {
    await carController.fetchCars({
        isAdmin: false
    }, (fetchSuccess, fetchResponse) => {

        if (!fetchSuccess || fetchResponse.processRespCode === 204) {
            res.status(fetchResponse.processRespCode).send(fetchResponse.toClient)
        }


        console.log(fetchResponse.toClient.processResult);
        // carController.fetchCarsImgByPath({
        //     cars: fetchResponse.toClient.processResult
        // }, (fetchImgSuccess, fetchImgResponse) => {
        //     res.status(fetchImgResponse.processRespCode).send(fetchImgResponse.toClient)
        // })

    })
})




//!Cars>


//     req: req
// }, (uploadSuccess, uploadResult) => {

//     if (uploadSuccess) {



//     }
//     res.status(uploadResult.processRespCode).send(uploadResult.toClient)
// })













// router.post("init/fuel", (req, res) => {
//     await fuelController.getFuelByName("Indefinido", async (success, result) => {
//         if (success) {
//             if (result[0].length === 0) {
//                 await fuelController.initializeFuelModel((initSuccess, result) => {
//                     if (initSuccess) {
//                         successInitArray.push(initSuccess)
//                     }
//                 });
//             } else {
//                 existArray.push(success)
//             }
//         }
//     })
// })

























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