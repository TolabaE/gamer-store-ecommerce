import mongoose from "mongoose";
import dotenvConfig from "../config/dotenv.config.js";
import Carts from "./mongodb/models/carts.model.js";
import Products from "./mongodb/models/products.model.js";
import Users from "./mongodb/models/user.model.js";


export default class Dao {
    constructor(){

        mongoose.set('strictQuery', false);
        this.connections = mongoose.connect(`mongodb+srv://coderUser:${dotenvConfig.mongo.PWD}@codercluster0.nvobhct.mongodb.net/${dotenvConfig.mongo.DB}?retryWrites=true&w=majority`,error=>{
            if(error) return console.log(error);
            else console.log('mongoose database connected');
        })
        //realizo la coneccion de mongoose con mis esquemas creado en mongoDb/models.
        const cartSchema = mongoose.Schema(Carts.schema);
        const productSchema = mongoose.Schema(Products.schema);
        const userSchema = mongoose.Schema(Users.schema);

        //realizo la conexion de mongoose con el modelo y el esquema.
        this.models = {
            [Carts.model] : mongoose.model(Carts.model,cartSchema),
            [Products.model] : mongoose.model(Products.model,productSchema),
            [Users.model] : mongoose.model(Users.model,userSchema),
        }
    }

    //creo los metodos que van a compartir todos los Managers repository.
    get = async(entity) =>{
        if(!this.models[entity]) throw new Error('la entidad indicada no esta definida en el modelo');
        return await this.models[entity].find({});
    }

    save = async(document,entity) =>{
        if(!this.models[entity]) throw new Error('la entidad indicada no esta definida en el modelo');
        return await this.models[entity].create(document);
    }

    getBy = async(options,entity) =>{
        if(!this.models[entity]) throw new Error('la entidad indicada no esta definida en el modelo');
        const result = await this.models[entity].findOne(options);
        return result;
    }

    updateId = async(id,newdoc,entity) =>{
        if(!this.models[entity]) throw new Error('la entidad indicada no esta definida en el modelo');
        const result = await this.models[entity].findByIdAndUpdate(id,newdoc);
        return result;
    }

    updateProp = async(params,prop,entity) =>{
        if(!this.models[entity]) throw new Error('la entidad indicada no esta definida en el modelo');
        return await this.models[entity].updateOne(params,{$set:prop})
        // updateOne({_id:idCart},{$set:{cart:cartFilter}})
    }

    deleteId = async(deleteID,entity) =>{
        if(!this.models[entity]) throw new Error('la entidad indicada no esta definida en el modelo');
        const result = await this.models[entity].deleteOne({_id:deleteID});
        return result;
    }
}