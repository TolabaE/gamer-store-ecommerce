import { Router } from "express";
import Contenedor from "../containers/container.js";
import __dirname from "../utils.js";

const router = Router();
const path = __dirname+'/json/productos.json';
const usuario = new Contenedor(path)

router.get('/',(req,res)=>{
    res.render('pages/home')
});

router.get('/cliente',(req,res)=>{
    res.render('pages/cliente')
})

router.get('/productos',async(req,res)=>{
    res.render('pages/products');//envio los datos a la carpeta de views.
});

router.post('/datos',async(req,res)=>{
    const producto = req.body;
    producto.precio=parseInt(producto.precio);//parse a numero el precio que recibo por el form.
    await usuario.save(producto);
    res.redirect('/');
});

export default router;