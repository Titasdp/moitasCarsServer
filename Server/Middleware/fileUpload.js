const fs = require('fs')

fileUpload = (dataObj, callback) => {
    let img;
    let uploadPath;
    let processResp = {}
    console.log(dataObj.req.files.img);
    if (!dataObj.req.files || Object.keys(dataObj.req.files).length === 0) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be an image attach to the request.",
            }
        }
        return callback(true, processResp)
    }

    img = dataObj.req.files.img
    uploadPath = process.cwd() + '/Server/images/' + img.name;
    // console.log(`${process.cwd()}/Server/images`)

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


fileGetter = (dataObj, callback) => {
    let imgPath = process.cwd() + `/Server/images/adlisa.jpg`;
    let uploadPath;
    let processResp = {}
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

}




// C:\Users\tiago\Documents\PersonalProjects\BackEnd\moitasCarsServer\moitasCarsServer\Server\images\adlisa.jpg

module.exports = {
    fileUpload,
    fileDelete,
    fileGetter
}