import GenericRepository from "./genericRepository.js";
import Carts from "../../dao/mongodb/models/carts.model.js";

export default class CartRepository extends GenericRepository{
    constructor(dao){
        super(dao,Carts.model);
    }

    //aqui van los metodos que van a ser de uso particular para el carrito.
    //crea un carrito nuevo con array vacio, fecha y retorna el  id que le fue asignado.
    createCart=async()=>{
        const object = {
            time: new Date(),
            cart:[]
        }
        const {_id} = await this.saveObject(object);
        return _id.valueOf();
    }

    //trae un carrito con su arreglo de acuerdo al ID que reciba como paramtro.
    getCartById=async(numeroId)=>{
        return await this.getByOptions({_id:numeroId});//me devuelve el carrito si lo encuentra sino me retorna null.
    }

    //accede a un objeto del array por id y seteo la propiedad cart con un nuevo arreglo vacio.
    clearCartById=async(clearId)=>{
        const clearCart = []; //seteo con un carrito vacio.
        return await this.updateOneProperty({_id:clearId},{cart:clearCart});
    }

    //agrega un producto en el carrito guardando su id y su cantidad, ya con todas las validaciones.
    addProductAtCart=async(idCart,productID,cantidad)=>{
        const {cart} = await this.getCartById(idCart)//busco el objeto que cumpla el id,luego desestructuro para objetener el carrito.
        let objeto = {}
        if (cart.some(pro=>pro.id == productID)){//creo una condicion,si en mi arreglo existe un objeto con el ID que me envian por parametro.
            objeto = cart.find(pro=>pro.id === productID)//accedo al objeto y le sumo la cantidad +1,
            objeto.cantidad += cantidad;
        }else{
            objeto.cantidad = cantidad;//sino me lo crea con la propiedad cantidad que sea igual a 1.
            objeto.id = productID;
            cart.push(objeto)//y pusheo ese nuevo objeto al array.
        }
        return await this.updateOneProperty({_id:idCart},{cart:cart});
        // updateOne({_id:idCart},{$set:{cart:cartFilter}})
    }

    //Este metodo borra un producto del arreglo en un carrito, de acuerdo al id que reciba.
    deleteProductAtCart=async(idCart,idProduct)=>{
        //los parametros ID del carrito y el producto ingresan ya con todas las validaciones.
        const {cart} = await this.getCartById(idCart);//desestructuro la propiedad cart del objeto de acuerdo al id del carrito.
        const cartFilter = cart.filter(item=>item.id != idProduct);//filtro del carrito,el producto que sea distinto al id que recibo por params.
        await this.updateOneProperty({_id:idCart},{cart:cartFilter});
    }
}