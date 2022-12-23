import mongoose from "mongoose";


const collection = 'users';

const schema = mongoose.Schema({
    nombre:{
        type:String,
        require:true
    },
    apellido:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    }
})

const registerModel = mongoose.model(collection,schema);

export default registerModel;