import mongoose from "mongoose";

const collection = 'carts';

const schema = mongoose.Schema({
    time:{
        type:String,
        require:true,
    },
    cart:{
        type:Array,
        require:true,
    }
})

const cartModel = mongoose.model(collection,schema);

export default cartModel;