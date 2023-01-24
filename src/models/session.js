import mongoose from "mongoose";


const collection = 'users';

const schema = mongoose.Schema({
    first_name:{
        type:String,
        require:true
    },
    last_name:{
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
    },
    image:{
        type:String
    },
    cart_ID:{
        type:String,
        require:true
    }
})

const registerModel = mongoose.model(collection,schema);

export default registerModel;