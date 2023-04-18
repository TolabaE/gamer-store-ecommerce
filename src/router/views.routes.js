import { Router } from "express";
import viewsControllers from "../controllers/views.controllers.js";


const router = Router();

router.get('/',viewsControllers.homePage);
router.get('/register',viewsControllers.registerPage);//muestro la vista register
router.get('/login',viewsControllers.loginPage);//muestro la vista login en el sitio
router.get('/form',viewsControllers.formPage);//muestro la vista del formulario para cargar productos.
router.get('/productos',viewsControllers.productsPage);//muestro la vista donde estan todos los productos.
router.get('/cart',viewsControllers.cartsPage);//muestro la vista del carrito de compras.
router.get('/profile',viewsControllers.profilePage);//muestro la vista del perfil de usuario.

router.post('/datos',viewsControllers.postForm);

export default router;