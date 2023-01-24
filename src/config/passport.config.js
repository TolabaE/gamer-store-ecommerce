import passport from "passport";
import local from "passport-local";
import registerModel from "../models/session.js";
import { createHash , isValidPassword } from "../utils.js";
import { PORT } from "../app.js";
import ContainerDAOs from "../daos/index.js";//importo el managers del carrito.


const localStrategy = local.Strategy;//primero llamamos a una estrategia de autenticacion del local.
const {ManagerCart} = ContainerDAOs;//desestructuro para obtener al manager cart.

//declaro una nueva estrategia local,

const initializePassport = async () =>{
    //el usernameField:es donde le indicamos que no tenemos username, y en caso contrario quiero que trabaje con email,es como el campo que es unico en el dato.
    //la variable passReqToCalback:te permite que en la funcion callback pueda recibir el parametro req.
    passport.use('register',new localStrategy({passReqToCallback:true,usernameField:'email'},async(req,email,password,done)=>{
        try {
            //la funcion done:es una funcion calback que utiliza passport para resolver middelwear y devolverle una respuesta al cliente.
            //aqui hago toda mi logica de registro.
            const {first_name,last_name} = req.body;
            // const imagen = req.file.filename;// 
            if (!first_name || !last_name || !req.file) return done(null,false,req.flash('messageRegister','Datos incompletos'));
            const existUser = await registerModel.findOne({email:email})//busco en la base mongo si el usuario existe.
            if (existUser) return done(null,false,req.flash('messageRegister',"el usuario ya esta registrado"));
            const hashedPass = await createHash(password);//creo un nuevo password encriptado, apartir del que me envian por el register.
            //aqui reconstruyo los datos que me enviaron del form en un objeto para poder almacenarlo en la base mongo

            //al registrarse le creo un carrito vacio,
            const idNewCart = await ManagerCart.createCart();//creo el carrito y me retorna el ID con el que fue asignado.
            const user ={
                first_name,
                last_name,
                email,
                password:hashedPass,//envio a la base,un password encriptado.
                image:`${req.protocol}://${req.hostname}:${PORT}/image/${req.file.filename}`,//guardo la ruta para acceder a la imagen
                cart_ID:idNewCart//este lo igual para que se cree con un ID.
            }
            const result = await registerModel.create(user);
            done(null,result,req.flash('messageRegister','success'))
        } catch (error) {
            done(error);
        }
    }))

    passport.use('login',new localStrategy({usernameField:'email'},async(email,password,done)=>{
        try {
            if(!email || !password) return done(null,false,{message:"valores incompletos",status:null});//verifico que no me allan enviado campos vacios.
            const user = await registerModel.findOne({email:email});//busco en la base de datos el usuario por su correo.
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

