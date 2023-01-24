import { Router } from "express";
import passport from "passport";
import uploader from "../config/multerconfig.js";//importamos la configuracion de multer para poder trabajar como un middlewear.


//cuando ya estas conectado a una base de mongo no podes crear otra base de dato ya que estas trabajando con esa.
const router = Router();


router.post('/register',uploader.single('image'),passport.authenticate('register',{failureRedirect:'/api/session/failedregister',successMessage:'/api/session/register'}),async(req,res)=>{
    const result = req.user;
    res.send({status:"success",payload:result._id});
})

router.get('/failedregister',(req,res)=>{
    // const result = req.flash('messageRegister');
    // console.log(result);
    res.status(500).send({status:"error",error:"a ocurrido un error al intentar registrar el usuario"})
})

router.post('/login',passport.authenticate('login',{failureRedirect:'/api/session/failedlogin'}),async (req,res)=>{
    const {first_name,last_name,email,image,cart_ID,_id} = req.user;
    req.session.user = {//cuales son las propiedades que tiene el usuario cuando me logeo
        first_name,
        last_name,
        email,
        image,
        cart_ID,
        _id
    }
    res.send({status:"success",name:req.user.first_name})
})

router.get('/failedlogin',(req,res)=>{
    res.status(500).send({status:"error",error:"A ocurrido un error al intentar logearse"})
})

router.get('/logout',(req,res)=>{
    req.session.destroy(err=>{ 
        if(err) return  res.status(500).send('no pude cerrar tu session');
    })
    res.redirect('/login')
})

export default router;