import { Router } from "express";
import passport from "passport";


//cuando ya estas conectado a una base de mongo no podes crear otra base de dato ya que estas trabajando con esa.
const router = Router();


router.post('/register',passport.authenticate('register',{failureRedirect:'/api/session/failedregister'}),async(req,res)=>{
    const result = req.user;
    res.send({status:"success",payload:result._id});
})

router.get('/failedregister',(req,res)=>{
    res.status(500).send({status:"error",error:"a ocurrido un error al intentar registrar el usuario"})
})

router.post('/login',passport.authenticate('login',{failureRedirect:'/api/session/failedlogin'}),async (req,res)=>{
    req.session.user = {
        name: `${req.user.nombre} ${req.user.apellido}`
    }
    res.send({status:"success",name:req.user.nombre})
})

router.get('/failedlogin',(req,res)=>{
    res.status(500).send({status:"error",error:"A ocurrido un error al intentar logearse"})
})


router.get('/profile',(req,res)=>{
    res.send(req.session.user)
})

router.get('/logout',(req,res)=>{
    req.session.destroy(err=>{ 
        if(err) return  res.status(500).send('no pude cerrar tu session');
    })
    res.redirect('/login')
})

export default router;