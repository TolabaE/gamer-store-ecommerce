import { Router } from "express";
import __dirname from "../utils.js";
import CartContainer from "../containers/containerCart.js";
import Contenedor from "../containers/container.js";

const router = Router();
const path = __dirname+'/json/carrito.json';
const ruta = __dirname+'/json/productos.json'
const carrito = new CartContainer(path);
const producto = new Contenedor(ruta);


router.get('/:idCart',async(req,res)=>{
    const {idCart} = req.params;
    const cart = await carrito.getCartById(idCart);
    if (cart == false) {
        res.send({status:"error",error:`There is no cart with ID:${idCart}`});
    }else{
        res.send({status:"success",payload:cart})
    }
})
//crea un nuevo carrito y me devuelve el ID que le fue asignado.
router.post('/',async(req,res)=>{
    const idCart = await carrito.createCart();
    res.send({status:"success",payload:`new Cart create with ID: ${idCart}`});
})
//agrega un producto en un carrito que reciba por ID.
router.post('/:idcart/product/:idProd',async(req,res)=>{
    const {idcart,idProd} = req.params;
    const stateCart = await carrito.existCartId(idcart);
    const stateProd = await producto.existsFile(idProd);
    if (stateCart === false) return res.send({status:"error",error:`no existe el carrito con el ID:${idcart} para agregar`});
    if (stateProd === false) return res.send({status:"error",error:`no existe el producto con el ID:${idProd} que desea agregar`});
    await carrito.addProductAtCart(idcart,idProd);
    res.send({status:"success",payload:"nuevo producto agregado con exito"});
})
//elimina un carrito del arreglo de acuerdo al id que reciba.
router.delete('/:deletCart',async(req,res)=>{
    const {deletCart} = req.params;
    const state = await carrito.deleteCartById(deletCart);
    if (state == true) res.send({status:"success",payload:`the Cart with ID:${deletCart} was deleted`});
    else res.send({status:"error",error:`there is not cart with ID:${deletCart}`});
})

//permite eliminar un producto por ID de acuerdo al ID del carrito que reciba por parametro.
router.delete('/:idCart/product/:idProd',async(req,res)=>{
    const {idCart,idProd} = req.params;
    const state = await carrito.existCartId(idCart);
    if(state == false) return res.send({status:"error",error:`the cart with ID:${idCart} is not exist`});
    const estado = await carrito.deleteProductAtCart(idCart,idProd);
    if (estado == false) {
        res.send({status:"error",error:`the file with id:${idProd} does not exist in the cart ${idCart}`});
    } else {
        res.send({status:"success",payload:`the product with ID:${idProd} from cart ${idCart} was delete`});
    }
})

export default router;