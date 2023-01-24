import mongoose from "mongoose";

const collection = 'chatsMessages';

const schema = mongoose.Schema({
    author:{
        type:String,
        require:true,
    },
    text:{
        type:String,
        require:true,
    }
})

const chatModel = mongoose.model(collection,schema)

export default chatModel;