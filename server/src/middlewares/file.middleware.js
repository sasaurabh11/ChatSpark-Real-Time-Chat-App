import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, Date.now() + path.extname(file.originalname))
    } 
  })
  
export const uploadmiddleware = multer({ 
    storage, 
})