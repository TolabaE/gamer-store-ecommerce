import { productService } from "../services/services.js";

const loginPage = (req,res) =>{
    res.render('pages/login')
};

const registerPage = (req,res) =>{
    res.render('pages/register');
};

const formPage = (req,res) =>{
    res.render('pages/update')
};

const clientPage = (req,res) =>{
    res.render('pages/cliente')
};

const productsPage = (req,res) =>{
    res.render('pages/products');//envio los datos a la carpeta de views.
};

const cartsPage = (req,res) =>{
    res.render('pages/cart')
};

const profilePage = (req,res) =>{
    const profile = req.session.user;
    res.render('pages/profile',{profile})//renderizo la vista profile y ademas los datos del usuario
};

const postForm =  async(req,res) =>{
    const producto = req.body;
    const result = await productService.saveObject(producto);
    res.send({status:"success",payload:result})
    res.redirect('/update');
};


export default {
    loginPage,
    registerPage,
    clientPage,
    postForm,
    profilePage,
    cartsPage,
    productsPage,
    formPage
}