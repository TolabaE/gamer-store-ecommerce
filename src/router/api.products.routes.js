import { Router } from "express";
import ContainerDAOs from "../daos/index.js";


const {ManagerProduct} = ContainerDAOs;


const router = Router();
const admi = true;


router.get('/',async(req,res)=>{
    const products = await ManagerProduct.getAll();
    res.send({status:'success',payload:products});
})

router.get('/:byId',async(req,res)=>{
    const {byId} = req.params;
    const state = await ManagerProduct.getById(byId);
    if (state != null) {
        res.send({payload:state})
    } else {
        res.send({status:'error',error:`no existe un producto con el ID:${byId}.`})
    }
})
//permite agregar productos,probar este metodo en postaman o thunderclients.
router.post('/',async(req,res)=>{
    if(admi === false)return res.send({status:"error",error:"metodo no disponible para usuarios"});
    const object = req.body;
    await ManagerProduct.save(object);
    res.send({status:"nuevo producto agregado a su base de datos"})
});
//elimina un producto por ID.
router.delete('/:iddelete',async(req,res)=>{
    if(admi === false)return res.send({status:"error",error:"metodo no disponible para usuarios"});
    const {iddelete} = req.params;    
    const state = await ManagerProduct.deleteById(iddelete);
    if (state == true) res.send({status:"producto eliminado"});
    else if (state == null) res.send({status:"error",error:`no existe el producto con el ID ${iddelete} a eliminar`});
})

//en este me permite actualizar un producto por su ID.
router.put('/:id',async(req,res)=>{
    if(admi === false)return res.send({status:"error",error:"metodo no disponible para usuarios"});
    const {id} = req.params;
    const newObjet = req.body;
    const state = await ManagerProduct.updateById(id,newObjet);
    if (state === true){
        res.send({status:"success",payload:`el producto con ID:${id} fue actualizado`});
    }else{
        res.send({status:'error',error:`no existe un producto con el ID:${id} a actualizar.`});
    }
})

export default router;