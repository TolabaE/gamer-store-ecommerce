

export default class Users {
    
    static get model(){
        return 'users';
    }

    static get schema(){
        return {
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
        };
    }
}