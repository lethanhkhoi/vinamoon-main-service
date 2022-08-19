const { config } = require("../config/constant");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config(config.COULDINARY_CONFIG)

const createUploader = (path, allowedFormats) => {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: path,
            allowedFormats: allowedFormats,
        },
    });

    const uploader = multer({
        storage: storage
    });
    return uploader
}

module.exports =  {
    createUploader,
    cloudinary
}
