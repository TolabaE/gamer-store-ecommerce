import mongoose from "mongoose";
import __dirname from "../utils.js";
import Contenedor from "./contFileProducts.js";
import CartContainer from "./contFileCart.js";
import ContainerMongoProducts from "./contMongoProducts.js";
import ContainerMongoCart from "./contMongoCart.js";
import productsModel from "../models/products.js";
import cartModel from "../models/cart.js";


//aqui escribimos la persistencia que queremos usar ya se Filesistem o mongoose;
let persistencia = 'mongoose';

let ManagerProduct
let ManagerCart

//son las rutas que envio a los contenedores de 
const path = __dirname + '/json/productos.json';
const pathCart = __dirname + '/json/carrito.json';


//el switch me permite cambiar mi variable de acuerdo al nombre de persistencia. y los metodos que tendra cada uno.
switch (persistencia) {
    case 'filesistem':

        ManagerCart = new CartContainer(pathCart);
        ManagerProduct = new Contenedor(path);
        break;

    case 'mongoose':

        const connection = mongoose.connect('mongodb+srv://coderUser:123454321@codercluster0.nvobhct.mongodb.net/ecommercebase?retryWrites=true&w=majority',error=>{
            if(error) console.log(error);
            else console.log('base mongoose conectada');
        });

        ManagerCart = new ContainerMongoCart(cartModel);
        ManagerProduct = new ContainerMongoProducts(productsModel);
        break;
}


const ContainerDAOs = {ManagerProduct,ManagerCart};

export default ContainerDAOs;