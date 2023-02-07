import { Router } from "express";
import passport from "passport";
import uploader from "../middlewares/multerconfig.js";//importamos la configuracion de multer para poder trabajar como un middlewear.
import sessionsController from "../controllers/sessions.controller.js";


//cuando ya estas conectado a una base de mongo no podes crear otra base de dato ya que estas trabajando con esa.
const router = Router();

router.get('/logout',sessionsController.getLogout);
router.get('/failedregister',sessionsController.registerFail);
router.get('/failedlogin',sessionsController.loginFail);

router.post('/register',uploader.single('image'),passport.authenticate('register',{failureRedirect:'/api/session/failedregister'}),sessionsController.postRegister);
router.post('/login',passport.authenticate('login',{failureRedirect:'/api/session/failedlogin'}),sessionsController.postLogin);

export default router;