import nodemailer from 'nodemailer';
import ContainerDAOs from "../daos/index.js";
import dotenvConfig from '../config/dotenv.config.js';

//desestructuro los managers que exporte desde la carpeta daos, para acceder a sus metodos
const { ManagerCart,ManagerProduct } = ContainerDAOs;


//creo una funcion que me trae los productos del usuario,apartir de su ID. 
const productsFilter = (carrito,productos) =>{
    const array = [];//creo un arreglo vacio.
    carrito.forEach(item => {
        productos.filter(producto =>{
            if (producto._id == item.id) {
                const {cantidad} = carrito.find(object => object.id === item.id);//obtengo la propiedad cantidad del carrito asociado
                //creo una nuevo objeto al cual le redefino las propiedades.
                let nuevoProducto = {
                    id: producto._id,
                    name: producto.nombre,
                    mark: producto.marca,
                    image: producto.image,
                    quantity: cantidad,
                    price: producto.precio,
                }
                array.push(nuevoProducto)
            }
        })
    })
    return array;
}

//creo una funcion envio de pedido
const orderDelivery = async(req,res) =>{
    const pedido = req.body
    console.log(pedido);
    const {email,first_name,cart_ID} = req.session.user; //obtengo el email del usuario que realiza la compra.
    const {product} = pedido;
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

    product.forEach(item=>{
        body += `
        <div>
            <img style="width:150px" src=${item.image} alt="">
            <h4>${item.name}</h4>
            <h5>${item.quantity}</h5>
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
            <h2> Precio Total:$${pedido.importe}</h2>
        `
    })

    //limpio el carrito de productos pasando su ID.
    await ManagerCart.clearCartById(cart_ID);
    res.send({status:"success",payload:result});
}

const addCart = async(req,res) =>{
    const {cantidad,prod_id}= req.body;//obtengo los datos que me envian por el fetch.
    const {cart_ID} = req.session.user;//obtengo el id de carrito del usuario que esta logeado
    await ManagerCart.addProductAtCart(cart_ID,prod_id,cantidad);//guardo los productos en el carrito que le fue asignado al registrarse.
    res.send({status:"success"});
}

const getCartProducts = async(req,res) =>{
    if(!req.session.user) return res.send({status:"error",error:"no estas logeado"});
    const {cart_ID,first_name} = req.session.user;//obtengo el id de carrito y el nombre del usuario que esta logeado
    const {cart} = await ManagerCart.getCartById(cart_ID);//ya tengo el carrito asociado a sus productos.
    const products = await ManagerProduct.getAll();
    const arreglo = productsFilter(cart,products);//llamo a la funcion de traerme los productos de acuerdo al ID del carrito del usuario.
    res.send({status:"success",payload:arreglo,client: first_name});
}

const removeProductCart = async(req,res) =>{
    const ProdCart = req.params;//obtengo el id que me pasan por parametro del producto a eliminar del carrito,
    const {cart_ID} = req.session.user;//obtengo el id del carrito para eliminar su producto.
    await ManagerCart.deleteProductAtCart(cart_ID,ProdCart.id);
    res.send({status:"success",payload:`producto eliminado del carrito`});
}

export default {
    orderDelivery,
    addCart,
    getCartProducts,
    removeProductCart
}