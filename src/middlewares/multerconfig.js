import multer from "multer";
import __dirname from "../utils.js";


const time = Date.now()

//configuramos donde queremos que guarde los archivos que se vallan subiendo.
const storage = multer.diskStorage({
    //le indicamos donde queremos que se guarden los archivos que vallan subiendo.
    destination: function (req,file,cb) {
        cb(null,__dirname+'/public/image')
    },
    //le indicamos el nombre que va a tener ese archivo.
    filename: function (req,file,cb){
        cb(null,time+'-'+file.originalname);
    }
})

const uploader = multer({storage});

export default uploader;