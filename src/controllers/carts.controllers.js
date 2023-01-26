import nodemailer from 'nodemailer';
import ContainerDAOs from "../daos/index.js";
import dotenvConfig from '../config/dotenv.config.js';

//desestructuro los managers que exporte desde la carpeta daos, para acceder a sus metodos
const { ManagerCart,ManagerProduct } = ContainerDAOs;

//creo una funcion envio de pedido
const orderDelivery = async(req,res) =>{
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
    console.log('esta linea se ejecuta');
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
}

const addCart = async(req,res) =>{
    const {cantidad,prod_id}= req.body;//obtengo los datos que me envian por el fetch.
    const {cart_ID} = req.session.user;//obtengo el id de carrito del usuario que esta logeado
    await ManagerCart.addProductAtCart(cart_ID,prod_id,cantidad);//guardo los productos en el carrito que le fue asignado al registrarse.
}

const getCartProducts = async(req,res) =>{
    if(!req.session.user) return res.send({status:"error",error:"no estas logeado"});
    const {cart_ID,first_name} = req.session.user;//obtengo el id de carrito y el nombre del usuario que esta logeado
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
                    id: prod._id,
                    nombre: prod.nombre,
                    marca: prod.marca,
                    image: prod.image,
                    cantidad: cantidad,
                    precio: prod.precio,
                }
                arreglo.push(producNew)
            }
        })
    });
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