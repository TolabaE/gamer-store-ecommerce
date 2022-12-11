import { Router } from "express";
import ContainerDAOs from "../daos/index.js";

const router = Router();

//desestructuro los managers que exporte desde la carpeta daos, para acceder a sus metodos
const {ManagerCart,ManagerProduct} = ContainerDAOs;


//me trae todos los datos del array de carrito
router.get('/',async(req,res)=>{
    const carts = await ManagerCart.readCart();
    res.send({status:"success",payload:carts});
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

export default router;