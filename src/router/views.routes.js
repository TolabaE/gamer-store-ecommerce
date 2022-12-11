import { Router } from "express";
import ContainerDAOs from "../daos/index.js";


const router = Router();
const {ManagerProduct} = ContainerDAOs;


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
    await ManagerProduct.save(producto);
    res.redirect('/');
});

export default router;