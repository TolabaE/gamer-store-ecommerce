'use strict';
class ContainerMongoCart {
    constructor(mongoModel){
        this.collection = mongoModel;
    }
    
    //lee y trae todos los datos que estan el mi base mongo
    readCart=async()=>{
        return await this.collection.find({});
    }

    //este metodo me permite sabeer si en mi base Mongo existe un objeto con el id que me pasan por parametro.
    existCartId=async(idCart)=>{
        return await this.collection.exists({_id:idCart});//me retorna el id del objeto si existe sino null.
    }

    //este metodo me retorna true si el producto existe en el carrito  o false caso contrario. 
    existIdProductAtCart=async(idCart,idProduct)=>{//aqui el id del carrito ingresa sabiendo que existe en el array.
        const arrayCart = await this.readCart();//traigo los datos de la base mongo
        if (arrayCart.some(obj=>obj.id == idCart)) {
            const objeto = arrayCart.find(ele=>ele.id == idCart)//obtengo al objeto que cumpla con ese ID
            return objeto.cart.some(prod=>prod.id == idProduct);//luego le hago un filtrado al carrito,si existe el producto;
        }else{
            return null;
        }
    }

    //trae un carrito con su arreglo de acuerdo al ID que reciba como paramtro.
    getCartById=async(numeroId)=>{
        return await this.collection.findOne({_id:numeroId});//me devuelve el objeto si lo encuentra sino me retorna null.
    }

    //crea un carrito nuevo con array vacio, fecha y retorna el  id que le fue asignado.
    createCart=async()=>{
        const {_id} = await this.collection.create({time: new Date(),cart:[]})
        return _id.valueOf();
    }

    //accede a un objeto del array por id y seteo la propiedad cart con un nuevo arreglo vacio.
    clearCartById=async(clearId)=>{
        //matchedCount:Recuento coincidente, modifiedCount:Cuenta modificada
        const {matchedCount,modifiedCount}= await this.collection.updateOne({_id:clearId},{$set:{cart:[]}});
        if ( matchedCount == 0) return false;//no encontro ni el carrito ni el objeto.
        else if (modifiedCount != 0 && matchedCount > 0) return true;//encontro el carrito y si lo modifico ya que existia algun objeto dentro.
        else if(modifiedCount == 0 && matchedCount > 0) return null;//si encontro el carrito pero no modifico nada,ya que el mismo esta vacio y no hay nada para limpiar.
    }
    
    //Este metodo borra un producto del arreglo en un carrito, de acuerdo al id que reciba.
    deleteProductAtCart=async(idCart,idProduct)=>{
        //los parametros ID del carrito y el producto ingresan ya con todas las validaciones.
        const {cart} = await this.collection.findOne({_id:idCart});//desestructuro la propiedad cart del objeto de acuerdo al id del carrito.
        const cartFilter = cart.filter(item=>item.id != idProduct);//filtro del carrito,el producto que sea distinto al id que recibo por params.
        await this.collection.updateOne({_id:idCart},{$set:{cart:cartFilter}});//actualizo el nuevo carrito sin el producto;
    }

    //agrega un producto en el carrito guardando su id y su cantidad, ya con todas las validaciones.
    addProductAtCart=async(idCart,productID,cantidad)=>{
        const {cart} = await this.collection.findOne({_id:idCart})//busco el objeto que cumpla el id,luego desestructuro para objetener el carrito.
        let objeto = {}
        if (cart.some(pro=>pro.id == productID)){//creo una condicion,si en mi arreglo existe un objeto con el ID que me envian por parametro.
            objeto = cart.find(pro=>pro.id === productID)//accedo al objeto y le sumo la cantidad +1,
            objeto.cantidad += cantidad;
        }else{
            objeto.cantidad = cantidad;//sino me lo crea con la propiedad cantidad que sea igual a 1.
            objeto.id = productID;
            cart.push(objeto)//y pusheo ese nuevo objeto al array.
        }
        await this.collection.updateOne({_id:idCart},{$set:{cart:cart}})
    }
}

export default ContainerMongoCart;