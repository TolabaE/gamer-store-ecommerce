import { Router } from "express";
import cartsControllers from "../controllers/carts.controllers.js";

const router = Router();


router.get('/',cartsControllers.getCartProducts);//me trae todos los datos del array de carrito
router.post('/order',cartsControllers.orderDelivery);
router.post('/pedido',cartsControllers.addCart);//recibo el pedido del lado del rervidor y lo guardo en la base de datos.
router.delete('/delete/:id',cartsControllers.removeProductCart);


// //me trae un carrito de acuerdo al ID.
// router.get('/:idCart',async(req,res)=>{
//     const {idCart} = req.params;
//     const cart = await ManagerCart.getCartById(idCart);//esto me devuelve null o el objeto si lo encuentra.
//     if (cart == null)  res.send({status:"error",error:`There is no cart with ID:${idCart}`});
//     else res.send({status:"success",payload:cart});
// })

// //agrega un producto en un carrito que reciba por ID.
// router.post('/:idcart/product/:idProd',async(req,res)=>{
//     const {idcart,idProd} = req.params;
//     const cartstate = await ManagerCart.existCartId(idcart);//me devuelve null si no existe el carrito con ese id o sino me retorna ID o true;
//     const prodstate = await ManagerProduct.getById(idProd);//me devuelve el objeto si lo encuentra, sino null.
//     if (cartstate == null) return res.send({status:"error",error:`no existe el carrito con el ID:${idcart} para agregar`});
//     if (prodstate == null) return res.send({status:"error",error:`no existe el producto con el ID:${idProd} que desea agregar`});
//     await ManagerCart.addProductAtCart(idcart,idProd);
//     res.send({status:"success",payload:"nuevo producto agregado con exito"});
// })

// //vacia los productos del array de un carrito de acuerdo al id que reciba.
// router.delete('/:deletCart',async(req,res)=>{
//     const {deletCart} = req.params;
//     // const condition = await ManagerCart.clearCartById(deletCart);//retorna true false o null ;
//     // if (condition == false) res.send({status:"error",error:`no existe el carrito con el ID:${deletCart}`});
//     // else if (condition == null) res.send({status:"error",error:`el carrito con el ID:${deletCart},no tiene productos para eliminar `});
//     // else if (condition == true) res.send({status:"success",payload:`los productos del carrito con el ID:${deletCart} fueron eliminados`});
// })

export default router;