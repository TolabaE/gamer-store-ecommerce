import { Router } from "express";
import Contenedor from "../contenedor.js";
import __dirname from "../utils.js";

const router = Router();
const ruta = __dirname+'/productos.json';
const usuario = new Contenedor(ruta);

router.get('/',(req,res)=>{
    res.render('pages/home')
});

router.post('/datos',async(req,res)=>{
    const producto = req.body;
    await usuario.save(producto);
    res.redirect('/');
});

router.get('/productos',async(req,res)=>{
    res.render('pages/products');//envio los datos a la carpeta de views.
});

router.get('/cliente',(req,res)=>{
    res.render('pages/cliente')
})

export default router;