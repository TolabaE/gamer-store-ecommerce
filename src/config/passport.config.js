import passport from "passport";
import local from "passport-local";
import registerModel from "../models/session.js";
import { createHash , isValidPassword } from "../utils.js";

const localStrategy = local.Strategy;//primero llamamos a una estrategia de autenticacion del local.

//declaro una nueva estrategia local,

const initializePassport = async () =>{
    //el usernameField:es donde le indicamos que no tenemos username, y en caso contrario quiero que trabaje con email,es como el campo que es unico en el dato.
    //la variable passReqToCalback:te permite que nuestro req,viaje atraves del callback.
    passport.use('register',new localStrategy({passReqToCallback:true,usernameField:'email'},async(req,email,password,done)=>{
        try {//la funcion done:es una funcion calback que utiliza passport para resolver middelwear,
            //aqui hago toda mi logica de registro.
            const {nombre,apellido} = req.body;
            if (!nombre || !apellido) return done(null,false,{status:"error",error:"valores incompletos"});
            const existUser = await registerModel.findOne({email})//busco en la base mongo si el usuario exxiste.
            if (existUser) return done(null,false,{status:"error",error:"el usuario ya esta registrado"});
            const hashedPass = await createHash(password);//creo un nuevo password encriptado, apartir del que me envian por el register.
            const user ={
                nombre,
                apellido,
                email,
                password:hashedPass,//envio a la base,un password encriptado.
            }
            const result = await registerModel.create(user);
            done(null,result,{status:"success"})
        } catch (error) {
            done(error);
        }
    }))

    passport.use('login',new localStrategy({usernameField:'email'},async(email,password,done)=>{
        try {
            if(!email || !password) return done(null,false,{message:"valores incompletos",status:null});//verifico que no me allan enviado campos vacios.
            const user = await registerModel.findOne({email});//busco en la base de datos el usuario por su correo.
            if (!user) return done(null,false,{message:"el correo ingresado no existe",status:false});//si no existe envio un estado de error indicando la situacion
            const existPassword = await isValidPassword(user,password);//esto me retorna true si la comparacion de contraseñas fue correcta o sino false.
            if (existPassword === false) return done(null,false,{status:"error",error:"la contraseña ingresada es incorrecta"}); 
            done(null,user)
        } catch (error) {
            done(error)
        }
    }))

    //son metodos internos de passport, que ejecutar ciertos niveles de autenticacion,que nos permite traer y guardar con mayor facilidad a los usuarios.
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })

    //debe recibir el id y traer el id de la base de datos. 
    passport.deserializeUser(async(id,done)=>{
        let result = await registerModel.findOne({_id:id});
        return done(null,result)
    })
}

//esta funcion la importamos a nuestra app principal que es alli donde la vamos a conectar.
export default initializePassport;

