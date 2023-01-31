

export default class Products {
    
    static get model(){
        return 'products';
    }

    static get schema(){
        return {
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
        }
    }
}