import multer from 'multer'
import path from 'path';


const storage: multer.StorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("multer working!!!!");
    // Use path.resolve to create an absolute path
    const uploadPath = path.resolve(__dirname, "../../../images");
    console.log(uploadPath, "directory from path");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const name: string = Date.now().toString() + "-" + file.originalname.split(" ").join("-");
    cb(null, name);
  },
});

export const upload = multer({ storage: storage });