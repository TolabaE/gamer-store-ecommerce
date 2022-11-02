import { Router } from "express";
import Contenedor from "../contenedor.js";

const router = Router();
const usuario = new Contenedor('eduardo');

router.get('/',async(req,res)=>{
    const datosProductos = await usuario.getAll();
    res.send(datosProductos);
});
router.get('/:id',async(req,res)=>{
    const {id} = req.params;//hago una desestrucuturacion del id que me mandan por parametro.
    const objetoExtraido = await usuario.getById(id);
    //si el objeto que distinto de null,me muestre el producto,sino ejecuta el else.
    if (objetoExtraido !== null) {
        res.send({producto:objetoExtraido});
    } else {
        res.send({error:'producto no encontrado'});
    }
});

router.post('/',async(req,res)=>{
    const objeto = req.body
    await usuario.save(objeto);
    res.send({status:'nuevo producto agregado con exito'});
});

router.put('/:id',async(req,res)=>{
    const {id} = req.params;
    const updateObjet = req.body;
    const estado = await usuario.updateById(id,updateObjet);
    //creo una condicion, si el estado es distinto de null,es por que el producto se actualizo.
    if (estado!==null) {
        res.send({status:`el producto con ID: ${id} fue actualizado`});
    } else {
        res.send({error:'no fue posible actualizar un producto con ese ID.'})
    }
});

router.delete('/:deleteid',async(req,res)=>{
    const {deleteid} = req.params;
    const estado = await usuario.deleteById(deleteid)
    if (estado !== null) {
        res.send({status:'su producto a sido eliminado con exito'});
    } else {
        res.send({error:'no existe un producto con ese ID a eliminar'})
    }
});

export default router;