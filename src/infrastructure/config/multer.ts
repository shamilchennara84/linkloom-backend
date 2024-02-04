import { log } from 'console';
import multer from 'multer'
import path from 'path';


const storage:multer.StorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('multer working!!!!');
    log(path.join(__dirname, "../../../images"), "directory from path");
    cb(null, path.join(__dirname, "../../../images"));
   
  },
  filename: function (req, file, cb) {
    const name:string =
      Date.now().toString() + "-" + file.originalname.split(" ").join("-");
    cb(null, name);
  },
});

export const upload = multer({ storage: storage });