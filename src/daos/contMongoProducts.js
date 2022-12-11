'use strict';

class ContainerMongoProducts {
    constructor(mongoModel){
        this.collection = mongoModel;
    }
    //me trae todos los productos de la base mongoDB.
    getAll=async()=>{
        return await this.collection.find({});
    }
    //me trae un producto de la base por el ID que me envian por parametro.
    getById=async(numeroId)=>{
        return await this.collection.findOne({_id:numeroId});//me devuelve el objeto si lo encuentra, caso contrario me retorna null.
    }
    //guarda un nuevo objeto a la base de Mongo.
    save=async(objeto)=>{
        objeto.code = Math.floor(Math.random()*10000000);
        objeto.timestamp = new Date();
        await this.collection.create(objeto);//esto haay que verificar si anda sin crear el la clave en el modelo/esquema
    }
    //actualiza un producto por ID del producto y recibe un nuevo objeto. 
    updateById=async(id,newobject)=>{
        const objeto = await this.collection.findOne({_id:id});//retorna el objeto null si no existe;
        if (objeto == null) {
            return false;// optimizar este codigo despues
        }else{
            // return await this.collection.updateOne({_id:id},{$set:{...newobject}}) este es otro metodo para actualizar
            await this.collection.findByIdAndUpdate(id,newobject);
            return true;
        }
    }
    //elimina un producto de acuerdo al ID que recibo por parametro.
    deleteById=async(deleteId)=>{
        const {deletedCount} = await this.collection.deleteOne({_id:deleteId});
        if (deletedCount == 0) return null;
        else return true;
        // return await this.collection.findByIdDelete(deleteId) 
    }
}

export default ContainerMongoProducts;