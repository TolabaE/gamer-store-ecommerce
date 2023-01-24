import { Router } from "express";
import ContainerDAOs from "../daos/index.js";
import nodemailer from 'nodemailer';
import dotenvConfig from "../config/dotenv.config.js";//gurado los datos en variables de entorno.

const router = Router();

//desestructuro los managers que exporte desde la carpeta daos, para acceder a sus metodos
const {ManagerCart,ManagerProduct} = ContainerDAOs;


//me trae todos los datos del array de carrito
router.get('/',async(req,res)=>{
    const {cart_ID} = req.session.user;//obtengo el id de carrito del usuario que esta logeado
    const carrito = await ManagerCart.getCartById(cart_ID);//ya tengo el carrito asociado a sus productos.
    const {cart} = carrito; //obtengo el arreglo de los pedidos guardados.
    const products = await ManagerProduct.getAll();
    const arreglo = [];//creo un arreglo vacio para poder pushearlo los productos.
    //recorro con un foreach para obtener el id del prod en el carrito
    cart.forEach(item => {
        //filtro los datos de los productos.
        products.filter(prod=>{
            if (prod._id == item.id) {
                const {cantidad} = cart.find(obj=>obj.id === item.id);//obtengo del obj en el carrito su propiedad cantidad,
                //creo un nuevo objeto y le redefino las propiedades.
                let producNew = {
                    nombre: prod.nombre,
                    marca: prod.marca,
                    image: prod.image,
                    cantidad: cantidad,
                    precio: prod.precio
                }
                arreglo.push(producNew)
            }
        })
    });
    res.send(arreglo);
})

router.post('/order', async (req,res)=>{
    const data = req.body;//obtengo la data que me envian del lado del front-end.
    const {email,first_name} = req.session.user //obtengo el email del usuario que realiza la compra.
    //creamos un trasporte con nodemailer para poder usarlo despues;
    const trasport = nodemailer.createTransport({
        service:'gmail',
        port: 587,
        auth:{
            user:`${dotenvConfig.cart.EMAIL}`,//escribo mi correo donde me logeo y verifique los pasos. 
            pass:`${dotenvConfig.cart.PWD}` //paso la contraseña que me fue generado al momento de verificar los pasos.
        }
    })

    let body = "";
    data.productos.forEach(item=>{
        body += `
        <div>
            <img style="width:150px" src=${item.image} alt="">
            <h4>${item.nombre}</h4>
            <h5>${item.cantidad}</h5>
        </div>
        `
    })

    //creo el cuerpo del mensaje, remitente y el contenido de lo que quiero enviar.
    const result = await trasport.sendMail({
        from:'usuario@gmail.com',
        to:'tolabaeduardo368@gmail.com',
        subject:'orden de compra',
        html:`
            <div>
                <p>Compra realizada por: ${email}</p>
                <p>Nombre: ${first_name}</p>
                ${body}
            </div>
            <h2> Precio Total:$${data.total}</h2>
        `
    })
    res.send({status:"success",payload:result});
})

//me trae un carrito de acuerdo al ID.
router.get('/:idCart',async(req,res)=>{
    const {idCart} = req.params;
    const cart = await ManagerCart.getCartById(idCart);//esto me devuelve null o el objeto si lo encuentra.
    if (cart == null)  res.send({status:"error",error:`There is no cart with ID:${idCart}`});
    else res.send({status:"success",payload:cart});
})

//crea un nuevo carrito y me devuelve el ID que le fue asignado.
router.post('/',async(req,res)=>{
    const idCart = await ManagerCart.createCart();
    res.send({status:"success",payload:`new Cart create with ID: ${idCart}`});
})

//agrega un producto en un carrito que reciba por ID.
router.post('/:idcart/product/:idProd',async(req,res)=>{
    const {idcart,idProd} = req.params;
    const cartstate = await ManagerCart.existCartId(idcart);//me devuelve null si no existe el carrito con ese id o sino me retorna ID o true;
    const prodstate = await ManagerProduct.getById(idProd);//me devuelve el objeto si lo encuentra, sino null.
    if (cartstate == null) return res.send({status:"error",error:`no existe el carrito con el ID:${idcart} para agregar`});
    if (prodstate == null) return res.send({status:"error",error:`no existe el producto con el ID:${idProd} que desea agregar`});
    await ManagerCart.addProductAtCart(idcart,idProd);
    res.send({status:"success",payload:"nuevo producto agregado con exito"});
})

//vacia los productos del array de un carrito de acuerdo al id que reciba.
router.delete('/:deletCart',async(req,res)=>{
    const {deletCart} = req.params;
    const condition = await ManagerCart.clearCartById(deletCart);//retorna true false o null ;
    if (condition == false) res.send({status:"error",error:`no existe el carrito con el ID:${deletCart}`});
    else if (condition == null) res.send({status:"error",error:`el carrito con el ID:${deletCart},no tiene productos para eliminar `});
    else if (condition == true) res.send({status:"success",payload:`los productos del carrito con el ID:${deletCart} fueron eliminados`});
})

//permite eliminar un producto por ID de acuerdo al ID del carrito que reciba por parametro.
router.delete('/:idCart/product/:idProd',async(req,res)=>{
    const {idCart,idProd} = req.params;
    const existCarr = await ManagerCart.existCartId(idCart);//me retorna null si no lo encuentra o true si existe;
    const existProd = await ManagerCart.existIdProductAtCart(idCart,idProd);//me devuelve true si el producto existe en el carrito o false si no existe.
    if (existCarr == null) return res.send({status:"error",error:`no existe el carrito con el ID:${idCart}`});
    if (existProd == false) return res.send({status:"error",error:`no existe el producto con el ID:${idProd} en el carrito`});
    await ManagerCart.deleteProductAtCart(idCart,idProd);
    res.send({status:"success",payload:`el producto con el ID:${idProd} fue eliminado del carrito con ID:${idCart}`})
})

//recibo el pedido del lado del rervidor y lo guardo en la base de datos.
router.post('/pedido',async(req,res)=>{
    const {cantidad,prod_id}= req.body;//obtengo los datos que me envian por el fetch.
    const {cart_ID} = req.session.user;//obtengo el id de carrito del usuario que esta logeado
    await ManagerCart.addProductAtCart(cart_ID,prod_id,cantidad);//guardo los productos en el carrito que le fue asignado al registrarse.
})

export default router;