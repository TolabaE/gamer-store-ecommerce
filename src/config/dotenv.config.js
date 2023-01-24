import dotenv from 'dotenv';

//inizializo al dotenv para que pueda leer mis variables de entorno.
dotenv.config()

export default {
    mongo:{
        USER: process.env.mongo_user,
        PWD:process.env.mongo_password,
        DB:process.env.mongo_database,
    },
    session:{SECRET:process.env.mongo_session_secret},
    cart:{
        EMAIL: process.env.api_cart_email,
        PWD: process.env.api_cart_password
    }
}