

export default class Chats {

    static get model(){
        return 'chats'
    }

    static get schema(){
        return {
            author:{
                type:String,
                require:true,
            },
            text:{
                type:String,
                require:true,
            }
        }
    }
}