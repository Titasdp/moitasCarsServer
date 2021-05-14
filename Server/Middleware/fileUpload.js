const fs = require('fs')
const readChunk = require('read-chunk');
const imageType = require('image-type');

//Upload File
fileUpload = async (dataObj, callback) => {
    let img;
    let uploadPath;
    let processResp = {}
    // console.log(dataObj.req.files.img);
    if (!dataObj.req.files || Object.keys(dataObj.req.files).length === 0) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be an file attach to the request.",
            }
        }
        return callback(true, processResp)
    }
    if (dataObj.req.files.img === null) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be an file attach to the request.",
            }
        }
        return callback(true, processResp)
    }
    if (await confirmIsImg(dataObj.req.files.img.mimetype)) {
        console.log(dataObj.req.files.img);
    }

    img = dataObj.req.files.img
    uploadPath = process.cwd() + '/Server/images/' + img.name;


    img.mv(uploadPath, function (err) {
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
                    processResult: uploadPath,
                    processError: null,
                    processMsg: "Image uploaded successfully.",
                }
            }
        }

        return callback(false, processResp)
    })

}
//Delete file
fileDelete = (dataObj, callback) => {
    let imgPath = process.cwd() + `/Server/images/adlisa.jpg`;
    let uploadPath;
    let processResp = {}
    fs.unlink(imgPath, function (err) {
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
                    processResult: null,
                    processError: null,
                    processMsg: "The file was successfully deleted.",
                }
            }
        }
        return callback(false, processResp)
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