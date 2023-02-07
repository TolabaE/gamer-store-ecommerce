import { Router } from "express";
import cartsControllers from "../controllers/carts.controllers.js";

const router = Router();


router.get('/',cartsControllers.getCartProducts);//me trae todos los datos del array de carrito

router.post('/order',cartsControllers.orderDelivery);
router.post('/pedido',cartsControllers.addCart);//recibo el pedido del lado del rervidor y lo guardo en la base de datos.

router.delete('/delete/:id',cartsControllers.removeProductCart);

export default router;