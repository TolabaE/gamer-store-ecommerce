import mongoose from "mongoose";

const collection = 'products';

const schema = new mongoose.Schema({
    nombre:{
        type:String,
        require:true,
    },
    marca:{
        type:String,
        require:true,
    },
    precio:{
        type:Number,
        require:true,
    },
    stock:{
        type:Number,
        require:true,
    },
    image:{
        type:String,
        require:true,
    },
    timestamp:{
        type:String
    },
    code:{
        type:Number
    }
})

const productsModel = mongoose.model(collection,schema);

export default productsModel;