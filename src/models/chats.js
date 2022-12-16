import mongoose from "mongoose";

const collection = 'chatsMessages';

const schema = mongoose.Schema({
    author:{
        id:{
            type:String,
            require:true,
        },
        nombre:{
            type:String,
            require:true,
        },
        apellido:{
            type:String,
            require:true,
        },
        edad:{
            type:Number,
            require:true,
        },
        avatar:{
            type:String,
            require:true,
        },
        alias:{
            type:String,
            require:true,
        }
    },
    text:{
        type:String,
        require:true,
    }
})

const chatModel = mongoose.model(collection,schema)

export default chatModel;