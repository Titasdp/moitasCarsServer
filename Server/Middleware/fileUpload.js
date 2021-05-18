const fs = require('fs')
const readChunk = require('read-chunk');
const imageType = require('image-type');

//Upload File
fileUpload = async (dataObj, callback) => {

    let img;
    let uploadPath;
    let processResp = {}

    if (!dataObj.req.files || Object.keys(dataObj.req.files).length === 0) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be a file attach to the request.",
            }
        }
        return callback(false, processResp)
    }
    if (dataObj.req.files.img === null) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be a file attach to the request.",
            }
        }
        return callback(false, processResp)
    }
    if (!confirmIsImg(dataObj.req.files.img.mimetype)) {

        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Your file must be an image.",
            }
        }
        return callback(false, processResp)

    }

    checkFileExistence(process.cwd() + '/Server/images/' + dataObj.req.files.img.name, (exist) => {
        if (exist) {
            processResp = {
                processRespCode: 409,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "There is already an image with that name, please change the image name.",
                }
            }
            return callback(false, processResp)
        }



        img = dataObj.req.files.img
        uploadPath = process.cwd() + '/Server/images/' + img.name;


        img.mv(uploadPath, function (err) {
            let functionSuccess = false
            if (err) {
                processResp = {
                    processRespCode: 500,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "Something went wrong please ty again later.",
                    }
                }
            } else {
                functionSuccess = true
                processResp = {
                    processRespCode: 200,
                    toClient: {
                        processResult: uploadPath,
                        processError: null,
                        processMsg: "Image uploaded successfully.",
                    }
                }
            }

            return callback(functionSuccess, processResp)
        })
    })
}
//Delete file
fileDelete = (dataObj, callback) => {

    let processResp = {}

    if (!dataObj.req.files || Object.keys(dataObj.req.files).length === 0) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be a file attach to the request.",
            }
        }
        return callback(false, processResp)
    }
    if (dataObj.req.files.img === null) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be a file attach to the request.",
            }
        }
        return callback(false, processResp)
    }
    if (!confirmIsImg(dataObj.req.files.img.mimetype)) {

        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Your file must be an image.",
            }
        }
        return callback(false, processResp)

    }

    fs.unlink(dataObj.req.sanitize(dataObj.req.body.oldImgPath), function (err) {

        let callbackSuccess = false

        if (err) {
            console.log(err);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong please ty again later.",
                }
            }
        } else {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "The file was successfully deleted.",
                }
            }
            callbackSuccess = true
        }
        return callback(callbackSuccess, processResp)
    });
}
//getter file 
fileGetter = async (dataObj, callback) => {
    let imgPath = process.cwd() + `/Server/images/adlisa.jpg`;
    let uploadPath;
    let processResp = {}


    await checkFileExistence(imgPath, (exist) => {
        if (!exist) {
            processResp = {
                processRespCode: 409,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "File fetch failed, there is no file  with that name",
                }
            }
            return callback(false, processResp)
        }
        fs.readFile(imgPath, function (err, data) {
            console.log(err);
            if (err) {
                processResp = {
                    processRespCode: 500,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "Something went wrong please ty again later.",
                    }
                }
            } else {
                processResp = {
                    processRespCode: 200,
                    toClient: {
                        processResult: data,
                        processError: null,
                        processMsg: "The file was successfully fetched.",
                    }
                }
            }
            return callback(false, processResp)
        });

    })
}




checkFileExistence = async (imgPath, callback) => {
    await fs.access(imgPath, (err, data) => {
        if (err) {
            return callback(false)
        }
        return callback(true)
    })
}

confirmIsImg = async (fileMimeType) => {
    if (fileMimeType.includes('image/')) {
        return true
    } else {
        return false
    }
}


// C:\Users\tiago\Documents\PersonalProjects\BackEnd\moitasCarsServer\moitasCarsServer\Server\images\adlisa.jpg

module.exports = {
    fileUpload,
    fileDelete,
    fileGetter
}