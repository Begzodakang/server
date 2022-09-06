const multer = require("multer")
const path = require("path")

const uploadImg = multer({
    storage:multer.diskStorage({
        destination:"public/uploads/images",
        filename:(req, file , cb)=>{
            cb(null , file.fieldname + Date.now()+path.extname(file.originalname))
        }
    }),
    limits:2000000
})
const uploadVideo = multer({
    storage:multer.diskStorage({
        destination:"public/uploads/video",
        filename:(req, file , cb)=>{
            cb(null , file.fieldname + Date.now()+path.extname(file.originalname))
        }
    }),
    limits:10000000
})
const uploadOthers = multer({
    storage:multer.diskStorage({
        destination:"public/uploads/others",
        filename:(req, file , cb)=>{
            cb(null , file.fieldname + Date.now()+path.extname(file.originalname))
        }
    }),
    limits:10000000
})
module.exports = {
    uploadImg,
    uploadVideo,
    uploadOthers
}