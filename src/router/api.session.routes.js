import { Router } from "express";
import registerModel from "../models/session.js";

//cuando ya estas conectado a una base de mongo no podes crear otra base de dato ya que estas trabajando con esa.
const router = Router();

router.get('/logout',(req,res)=>{
    req.session.destroy(err=>{ 
        if(err) return  res.status(500).send('no pude cerrar tu session');
    })
    res.send('Deslogueado');
})
router.post('/register',async(req,res)=>{
    const {nombre,apellido,email,password} = req.body;
    if (!nombre || !apellido || !email || !password) return res.status(400).send({status:"error",error:"valores incompletos"});
    const existUser = await registerModel.findOne({email})//busco en la base mongo si el usuario exxiste.
    if (existUser) return res.send({status:"error",error:"el usuario ya esta registrado"});
    const user ={
        nombre,
        apellido,
        email,
        password,
    }
    const result = await registerModel.create(user);
    res.send({status:"success",payload:result._id});
})

router.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).send({status:null});//verifico que no me allan enviado campos vacios.
    const user = await registerModel.findOne({email,password});//busco en la base de datos el usuario.
    //si no existe envio un estado de error indicando la situacion
    if (!user) return res.status(400).send({status:false});
    req.session.user = {
        name: `${user.nombre} ${user.apellido}`
    }
    res.send({status:"success",name:user.nombre})
}) 


export default router;