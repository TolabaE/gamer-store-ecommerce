//creo las definiciones que mis modelos de la base de datos de mongo db.

export default class Carts {
    
    static get model(){
        return 'carts';
    }

    static get schema(){
        return {
            time:String,
            cart:{
                type:Array,
                require:true
            }
        };
    }
}