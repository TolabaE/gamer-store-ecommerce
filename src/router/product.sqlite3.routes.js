import { Router } from "express";
import db from "../data/knex.js";
import ContainerSQL from "../containers/containerSqlite.js";

const containerSqlite = new ContainerSQL(db,'products');
const fecha = new Date().toDateString();

const router = Router();

//trae todos los productos que esten en la base de datos.
router.get('/',async(req,res)=>{
    const productos = await containerSqlite.getAll();
    res.send(productos);
})
//me trae un producto de acuerdo al ID que me envian por parametro.
router.get('/:getId',async(req,res)=>{
    const {getId} = req.params;
    const product = await containerSqlite.getById(getId);
    if (product.length === 0){
        res.send({status:"error",payload:`No existe un producto con el ID: ${getId} en la base de datos.`})
    } else {
        res.send({status:"success",payload:product});
    }
})
//permite guradar un nuevo producto a la base de datos.
router.post('/',async(req,res)=>{
    const products = req.body;
    products.data = fecha;
    await containerSqlite.save(products);
    res.send({status:"success",payload:'new products add'})
})
//actualiza uno de los productos de la base de datos de acuerdo al ID que reciba como parametro.
router.put('/:updateId',async(req,res)=>{
    const productnew = req.body;
    const {updateId} = req.params;
    const arrayProducts = await containerSqlite.getAll();
    const state = arrayProducts.some(prod=>prod.id === parseInt(updateId));//me aseguro de que el producto exista en mi base de datos.
    if (state == true) {
        await containerSqlite.updateProduct(productnew,updateId);
        res.send({status:"success",payload:"new product update for ID"});
    } else {
        res.send({status:"error",payload:"The product you want to update does not exist"})
    }
})
//permite eliminar un producto de acuerdo al ID que le enviemos por parametro.
router.delete('/:id',async(req,res)=>{
    const {id} = req.params;
    const data = await containerSqlite.getAll();
    const state = data.some(prod=>prod.id === parseInt(id));//me aseguro si el producto a  eliminar existe en mi base de datos.
    if (state == true) {
        await containerSqlite.deleteById(id);
        res.send({status:"success",payload:`product whit ID:${id} was delete`});
    } else {
        res.send({status:"error",error:"not exist the product"});
    }
})

export default router;