import { Router } from "express";
import ContainerDAOs from "../daos/index.js";
import arrayFaker from "../mocks/mock.js";


const router = Router();
const {ManagerProduct} = ContainerDAOs;


//muestro la vista register
router.get('/',(req,res)=>{
    res.render('pages/register');
})
//muestro la vista login en el sitio
router.get('/login',(req,res)=>{
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

router.post('/datos',async(req,res)=>{
    const producto = req.body;
    await ManagerProduct.save(producto);
    res.redirect('/form');
});

//creo la vista para trabajar con productos creados con faker
router.get('/test',(req,res)=>{
    res.send({status:'success',payload:arrayFaker});
})


export default router;