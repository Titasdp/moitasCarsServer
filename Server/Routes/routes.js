const express = require("express");
const router = express.Router(); // router
const carController = require("../Controllers/car_controller")

//<Middleware
const fileUploader = require("../Middleware/fileUpload")
const tokenUtilities = require("../Middleware/tokenFunctions")
//Middleware>

//<Init
const brandController = require("../Controllers/brand_controller")
const fuelController = require("../Controllers/fuel_controller")
const engineController = require("../Controllers/engine_controller")
//Init>
const testimonialController = require("../Controllers/testimonial_controller")
const carModelController = require("../Controllers/car_model_controller")
const userController = require("../Controllers/user_controller");
const {
    sync
} = require("read-chunk");
//!<Brands


/**
 * Function: fetchBrands
 * *Working
 */
router.get("/brands", async (req, res) => {
    brandController.fetchBrands(req, (fetchSuccess, fetchResponse) => {
        res.status(fetchResponse.processRespCode).json(fetchResponse.toClient)
    })
})

/**
 * Function: Initialize
 * *Working
 */
router.post("/init/brands", async (req, res) => {
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }
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
    })
})


/**
 * Function: AddBrand
 * *Working
 */
router.post("/brands", async (req, res) => {
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }
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
})

/**
 * Function: UpdateBrand
 * *Working
 */
router.patch("/brands/:id/designation", async (req, res) => {

    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (validToken, result) => {
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
})

/**
 * Function: DeleteBrand
 * *Working
 */
router.delete("/engines/:id", async (req, res) => {
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }
        let fetchConfirmModelExist = false
        carModelController.fetchCarModelByBrandId(req.sanitize(req.params.id), (fetchSuccess, fetchResult) => {
            if (fetchSuccess) {
                if (fetchResult.processRespCode === 200) {
                    fetchConfirmCarExist = true
                }
                brandController.deleteBrand({
                    fetchConfirmModelExist: fetchConfirmModelExist,
                    req: req
                }, (deleteSuccess, deleteResult) => {
                    res.status(deleteResult.processRespCode).send(deleteResult.toClient)
                });
            } else {
                res.status(fetchResult.processRespCode).send(fetchResult.toClient)
            }
        })
    })
})
//!Brands>

//!<Engines


/**
 * Function: fetchEngines
 * *Working
 */
router.get("/engines", async (req, res) => {
    engineController.fetchEngines(req, (fetchSuccess, fetchResponse) => {
        res.status(fetchResponse.processRespCode).json(fetchResponse.toClient)
    })
})

/**
 * Function: Initialize
 * *Working
 */
router.post("/init/engines", async (req, res) => {
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }
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
})

/**
 * Function: AddEngine
 * *Working
 */
router.post("/engines", async (req, res) => {
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }
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
})

/**
 * Function: UpdateEngine
 * *Working
 */
router.put("/engines/:id", (req, res) => {
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }
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
})


/**
 * Function: DeleteFuel
 * *Working
 */
router.delete("/engines/:id", async (req, res) => {
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }
        let fetchConfirmCarExist = false
        carController.fetchCarByEngineId(req.sanitize(req.params.id), (fetchSuccess, fetchResult) => {
            if (fetchSuccess) {
                if (fetchResult.processRespCode === 200) {
                    fetchConfirmCarExist = true
                }
                engineController.deleteEngine({
                    fetchConfirmCarExist: fetchConfirmCarExist,
                    req: req
                }, (deleteSuccess, deleteResult) => {
                    res.status(deleteResult.processRespCode).send(deleteResult.toClient)
                });
            } else {
                res.status(fetchResult.processRespCode).send(fetchResult.toClient)
            }
        })
    })
})
//!Engines>

//!<Fuels
router.get("/fuels", async (req, res) => {
    fuelController.fetchFuels(req, (fetchSuccess, fetchResponse) => {
        res.status(fetchResponse.processRespCode).json(fetchResponse.toClient)
    })
})

/**
 * Function: Initialize
 * *Working
 */
router.post("/init/fuels", async (req, res) => {
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }
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
})

/**
 * Function: AddFuel
 * *Working
 */
router.post("/fuels", async (req, res) => {
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }
        let fetchConfirmExist = false
        fuelController.fetchFuelByName(req.sanitize(req.body.designation), (fetchFuelSuccess, fetchFuelResult) => {
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
})
/**
 * Function: UpdateFuel
 * *Working
 */
router.patch("/fuels/:id/designation", (req, res) => {
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }
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
})


/**
 * Function: DeleteFuel
 * *Working
 */
router.delete("/fuels/:id", async (req, res) => {
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }
        let fetchConfirmCarExist = false
        carController.fetchCarByFuelId(req.sanitize(req.params.id), (fetchSuccess, fetchResult) => {
            if (fetchSuccess) {
                if (fetchResult.processRespCode === 200) {
                    fetchConfirmCarExist = true
                }

                // console.log(fetchConfirmCarExist);
                fuelController.deleteFuel({
                    fetchConfirmCarExist: fetchConfirmCarExist,
                    req: req
                }, (deleteSuccess, deleteResult) => {
                    res.status(deleteResult.processRespCode).send(deleteResult.toClient)
                });
            } else {
                res.status(fetchResult.processRespCode).send(fetchResult.toClient)
            }
        })
    })
})
//!Fuels>


//!<Models
/**
 * Function: getAllFuels
 * *working
 */
router.get("/fuels", async (req, res) => {
    carModelController.fetchModels(req, (fetchSuccess, fetchResponse) => {
        res.status(fetchResponse.processRespCode).json(fetchResponse.toClient)
    })
})
/**
 * Function: AddCarModel
 * *Working
 */
router.post("/models", async (req, res) => {

    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }
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
})

/**
 * Function: updateCarModel
 * *Working
 */
router.put("/models/:id", (req, res) => {

    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }

        let fetchConfirmExist = false
        carModelController.fetchModelByName(req.sanitize(req.body.designation), (fetchModelSuccess, fetchModelResult) => {
            if (fetchModelSuccess) {
                if (fetchModelResult.processRespCode === 200) {
                    fetchConfirmExist = true
                }
                carModelController.updateModel({
                    fetchConfirmExist: fetchConfirmExist,
                    newDesignation: req.sanitize(req.body.designation),
                    idModel: req.sanitize(req.params.id),
                    designation: req.sanitize(req.body.designation),
                    idBrand: req.sanitize(req.body.idBrand),
                }, (updateModelSuccess, updateModelResult) => {
                    res.status(updateModelResult.processRespCode).send(updateModelResult.toClient)
                });

            } else {
                res.status(fetchModelResult.processRespCode).send(fetchModelResult.toClient)
            }
        })
    })
})


/**
 * Function: DeleteModel
 * *Working
 */
router.delete("/models/:id", async (req, res) => {
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }
        let fetchConfirmCarExist = false
        carController.fetchCarByModelId(req.sanitize(req.params.id), (fetchSuccess, fetchResult) => {
            if (fetchSuccess) {
                if (fetchResult.processRespCode === 200) {
                    fetchConfirmCarExist = true
                }

                // console.log(fetchConfirmCarExist);
                carModelController.deleteModel({
                    fetchConfirmCarExist: fetchConfirmCarExist,
                    req: req
                }, (deleteSuccess, deleteResult) => {
                    res.status(deleteResult.processRespCode).send(deleteResult.toClient)
                });
            } else {
                res.status(fetchResult.processRespCode).send(fetchResult.toClient)
            }
        })
    })
})

//!Models>

//!<Cars
/**
 * Function: AddCar
 * *Working
 */
router.post("/cars", async (req, res) => {
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }

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
                req: req,
                publisherId: result.toClient.processResult
            }, (addSuccess, addResponse) => {
                res.status(addResponse.processRespCode).send(addResponse.toClient)
            })
        })
    })
})
/**
 * Function: updateCar except img
 * *Working
 */
router.put("/cars/:id", async (req, res) => {

    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }


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
})
/**
 * Function: patchCarImg
 * *Working
 */
router.patch("/cars/:id/image", async (req, res) => {

    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }
        carController.updateCarPicture({
            req: req
        }, (updateSuccess, updateResponse) => {
            res.status(updateResponse.processRespCode).send(updateResponse.toClient)
        })
    })
})
/**
 * Function: fetchCar
 * *Working
 */
router.get("/cars", async (req, res) => {
    let isAdmin = false
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (success) {
            isAdmin = true
        }
        if (!success) {
            if (result.processRespCode === 500) {
                res.status(result.processRespCode).send(result.toClient)
            }
        }

        await carController.fetchCars({
            isAdmin: isAdmin
        }, (fetchSuccess, fetchResponse) => {

            if (!fetchSuccess || fetchResponse.processRespCode === 204) {
                res.status(fetchResponse.processRespCode).send(fetchResponse.toClient)
            }
            carController.fetchCarsImgByPath({
                cars: fetchResponse.toClient.processResult
            }, (fetchImgSuccess, fetchImgResponse) => {
                res.status(fetchImgResponse.processRespCode).json(fetchImgResponse.toClient)
            })

        })

    })
})

/**
 * Function: delete Car
 * *Working
 */
router.put("/cars/:id", async (req, res) => {
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }
        await carController.deleteCar({
            req: req
        }, (deleteSuccess, deleteResult) => {
            res.status(deleteResult.processRespCode).send(deleteResult.toClient)
        })
    })
})
//!Cars>














//!<User routes
/**
 * DoUserLogin
 * *Completed
 */
router.post("/login", (req, res) => {
    let fetchConfirmExist = false
    userController.getUserByName(req, (fetchSuccess, fetchResult) => {
        if (!fetchSuccess) {
            res.status(fetchResult.processRespCode).send(fetchResult.toClient)
        }

        if (fetchResult.processRespCode === 200) {
            fetchConfirmExist = true
        }
        userController.userLogin({
            fetchConfirmExist: fetchConfirmExist,
            userData: fetchResult.toClient.processResult[0],
            password: req.sanitize(req.body.password),
        }, (loginSuccess, loginResult) => {
            res.status(loginResult.processRespCode).send(loginResult.toClient)
        });
    });
});

/**
 * Initialize
 * *Completed
 */
router.post("/init/users", (req, res) => {
    let fetchConfirmExist = false
    userController.fetchUsers(req, (fetchSuccess, fetchResult) => {
        if (!fetchSuccess) {
            res.status(fetchResult.processRespCode).send(fetchResult.toClient)
        }

        if (fetchResult.processRespCode === 200) {
            fetchConfirmExist = true
        }

        userController.initUser({
            fetchConfirmExist: fetchConfirmExist,
        }, (initSuccess, initResult) => {
            res.status(initResult.processRespCode).send(initResult.toClient)
        });


    });
});

/**
 * patchPassword
 * *Completed
 */
router.patch("/users/:id/password", (req, res) => {
    let fetchConfirmExist = false
    userController.getUserById(req, (fetchSuccess, fetchResult) => {
        if (!fetchSuccess) {
            res.status(fetchResult.processRespCode).send(fetchResult.toClient)
        }

        if (fetchResult.processRespCode === 200) {
            fetchConfirmExist = true
        }
        userController.updateUserPassword({
            fetchConfirmExist: fetchConfirmExist,
            userData: fetchResult.toClient.processResult[0],
            oldPassword: req.sanitize(req.body.oldPassword),
            newPassword: req.sanitize(req.body.newPassword),

        }, (updateSuccess, updateResult) => {
            res.status(updateResult.processRespCode).send(updateResult.toClient)
        });
    });
});
//!User routes>



//!<Testimonial routes
/**
 * Function: fetchBrands
 * *Working
 */
router.get("/brands", async (req, res) => {
    testimonialController.fetchTestimonials(req, (fetchSuccess, fetchResponse) => {
        res.status(fetchResponse.processRespCode).json(fetchResponse.toClient)
    })
})
/**
 * Function: AddCar
 * *Working
 */
router.post("/testimonials", async (req, res) => {
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }

        testimonialController.addTestimonial({
            req: req,
            publisherId: result.toClient.processResult
        }, (addSuccess, addResponse) => {
            res.status(addResponse.processRespCode).send(addResponse.toClient)
        })
    })

})


/**
 * Function: UpdateTestimonial
 * *Working
 */
router.put("/testimonials", async (req, res) => {
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }
        testimonialController.updateTestimonial({
            req: req,
        }, (updateSuccess, updateResponse) => {
            res.status(updateResponse.processRespCode).send(updateResponse.toClient)
        })
    })

})

/**
 * Function: deleteTestimonial
 * *Working
 */
router.put("/testimonials", async (req, res) => {
    tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (success, result) => {
        if (!success) {
            res.status(result.processRespCode).send(result.toClient)
        }

        testimonialController.deleteTestimonial({
            req: req,
        }, (deleteSuccess, deleteResponse) => {
            res.status(deleteResponse.processRespCode).send(deleteResponse.toClient)
        })
    })

})







//!Testimonial routes>



// router.get("/test", async (req, res) => {
//     tokenUtilities.validateTokenAndIfAdmin(req.headers.authorization, async (validToken, result) => {
//         res.status(result.processRespCode).send(result.toClient)
//     })
// })



module.exports = router;