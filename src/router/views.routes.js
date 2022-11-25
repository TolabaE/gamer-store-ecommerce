import { Router } from "express";
// import Contenedor from "../containers/container.js";
import __dirname from "../utils.js";
import ContainerSQL from "../containers/containerSqlite.js";
import db from "../data/knex.js";//importo la basede datos para trabajar.

const router = Router();
const path = __dirname+'/json/productos.json';
// const usuario = new Contenedor(path)
const containerSqlite = new ContainerSQL(db,'products')
const fecha = new Date().toDateString();

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
    producto.precio=parseInt(producto.precio);//parse a numero el precio que recibo por el formulario que esta en la vista de home.
    producto.data = fecha;// agrego la fecha .
    await containerSqlite.save(producto);
    // await usuario.save(producto);
    res.redirect('/');
});

export default router;