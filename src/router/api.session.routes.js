import { Router } from "express";
import passport from "passport";
import uploader from "../config/multerconfig.js";//importamos la configuracion de multer para poder trabajar como un middlewear.
import sessionsController from "../controllers/sessions.controller.js";


//cuando ya estas conectado a una base de mongo no podes crear otra base de dato ya que estas trabajando con esa.
const router = Router();


router.post('/register',uploader.single('image'),passport.authenticate('register',{failureRedirect:'/api/session/failedregister'}),sessionsController.postRegister);
router.get('/failedregister',sessionsController.registerFail);
router.post('/login',passport.authenticate('login',{failureRedirect:'/api/session/failedlogin'}),sessionsController.postLogin);
router.get('/failedlogin',sessionsController.loginFail);
router.get('/logout',sessionsController.getLogout);

export default router;