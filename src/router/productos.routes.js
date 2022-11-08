import { Router } from "express";
import Contenedor from "../contenedor.js";

const router = Router();
const usuario = new Contenedor('eduardo');

router.get('/',(req,res)=>{
    res.render('pages/home')
});

router.post('/datos',async(req,res)=>{
    const producto = req.body;
    await usuario.save(producto);
    res.redirect('/');
});

router.get('/productos',async(req,res)=>{
    const baseDatos = await usuario.getAll();//traigo los datos guardados en el JSON.
    res.render('pages/products',{baseDatos});//envio los datos a la carpeta de views.
});

export default router;