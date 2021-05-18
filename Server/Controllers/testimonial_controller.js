const testimonialModel = require("../Models/testimonial_model")
const sequelize = require("../Database/connection")
const uniqid = require('uniqid');

//*Completed
fetchTestimonials = (dataObj, callback) => {
    let query = `SELECT * FROM testimonial`

    if (!dataObj.isAdmin) {
        query = `SELECT testimonial.person_name, testimonial.testimonial_text FROM testimonial`
    }
    let processResp = {}


    sequelize
        .query(query, {
            model: testimonialModel.Testimonial
        })
        .then(data => {
            let respCode = 200
            let respMsg = "Data fetched successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: respMsg,
                }
            }

            return callback(true, processResp)
        })
        .catch(error => {
            console.log(error);
            processResp = {
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


//*Completed
addTestimonial = (dataObj, callback) => {
    let processResp = {}

    if (dataObj.req.personName === null || dataObj.req.testimonialText === null) {
        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Please field all the require fields.",
            }
        }
        return callback(false, processResp)
    }

    sequelize
        .query(
            "INSERT INTO testimonial (id_testimonial,person_name, testimonial_text,id_user) VALUES (:newTestimonial);", {
                replacements: {
                    newTestimonial: [
                        uniqid(undefined, "-testimonial"),
                        dataObj.req.sanitize(dataObj.req.body.personName),
                        dataObj.req.sanitize(dataObj.req.body.testimonialText),
                        dataObj.req.sanitize(dataObj.req.body.idUser),
                    ]
                }
            }, {
                model: testimonialModel.Testimonial
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "A new engine type was been created successfully.",
                }
            }
            return callback(true, processResp)
        })
        .catch(error => {
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something went wrong please try again later.",
                }
            }
            return callback(false, processResp)
        });
};

//*Completed
updateTestimonial = (dataObj, callback) => {
    let processResp = {}


    if (dataObj.req.body.personName === null || dataObj.req.body.testimonialText === null) {
        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Please field all the require fields.",
            }
        }
        return callback(false, processResp)
    }


    sequelize
        .query(
            "UPDATE fuel SET person_name = :person_name,testimonial_text=:testimonial_text Where testimonial.id_testimonial = :id_testimonial;", {
                replacements: {
                    person_name: dataObj.req.sanitize(dataObj.req.body.personName),
                    testimonial_text: dataObj.req.sanitize(dataObj.req.body.testimonialText),
                    id_testimonial: dataObj.req.sanitize(dataObj.req.params.id),
                }
            }, {
                model: testimonialModel.Testimonial
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "The brand was updated successfully",
                }
            }
            return callback(true, processResp)
        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong, please try again later.",
                }
            }
            return callback(true, processResp)
        });
};

//*Completed
deleteTestimonial = (dataObj, callback) => {
    let processResp = {}


    sequelize
        .query(
            `DELETE  FROM testimonial  WHERE id_testimonial = :id_testimonial`, {
                replacements: {
                    id_testimonial: dataObj.req.sanitize(dataObj.req.params.id),
                }
            }, {
                model: testimonialModel.Testimonial
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "The brand was updated successfully",
                }
            }
            return callback(true, processResp)
        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong, please try again later.",
                }
            }
            return callback(true, processResp)
        });
}



module.exports = {
    fetchTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial
};