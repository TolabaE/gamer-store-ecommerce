import { Router } from "express";
import ContainerDAOs from "../daos/index.js";


const router = Router();
const {ManagerProduct,ManagerCart} = ContainerDAOs;//desestructuro.

//muestro la vista register
router.get('/',(req,res)=>{
    res.render('pages/register');
})

//muestro la vista login en el sitio
router.get('/login',(req,res)=>{
    // const name = req.session.user
    res.render('pages/login')
})

router.get('/form',(req,res)=>{
    res.render('pages/home')
});

router.get('/cliente',(req,res)=>{
    res.render('pages/cliente')
})

router.get('/productos',async(req,res)=>{
    res.render('pages/products');//envio los datos a la carpeta de views.
});

router.get('/cart',(req,res)=>{
    res.render('pages/cart')
})

router.get('/profile',(req,res)=>{
    const profile = req.session.user;
    res.render('pages/profile',{profile})//renderizo la vista profile y ademas los datos del usuario
})

router.post('/datos',async(req,res)=>{
    const producto = req.body;
    await ManagerProduct.save(producto);
    res.redirect('/form');
});

export default router;