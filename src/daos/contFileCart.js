"use strict";
import fs from 'fs';

const fecha = new Date().toDateString();

class CartContainer{
    constructor(path){
        this.path = path;
        this.init();
    }
    init = async()=>{
        //si no existe la ruta del archivo,creo un nuevo con un array vacio.
        if (!fs.existsSync(this.path)) await fs.promises.writeFile(this.path,JSON.stringify([]));
    }

    //me trae todos los datos de la base mongo DB.
    readCart = async()=>{
        const arrayData = await fs.promises.readFile(this.path,'utf-8');
        return JSON.parse(arrayData);
    }
    //verifico si el objeto existe en mi json.
    existCartId=async(idexist)=>{
        const data = await this.readCart();
        const valor = data.some(cart => cart.id === parseInt(idexist));
        if (valor == false) return null; //si el valor es igual false retorna null o sino true
        else return true;
    }

    //devuelve true si el producto existe en el carrito;
    existIdProductAtCart=async(idCart,idProd)=>{
        const arrayCart = await this.readCart();//traigo los datos 
        if (arrayCart.some(item=>item.id === parseInt(idCart))) {
            const object = arrayCart.find(obj=>obj.id === parseInt(idCart));//obtengo el carrito de acuerdo al ID que me envian;
            return object.cart.some(prod=>prod.id === parseInt(idProd));//verifico si el producto con ID existe en el carrito;
        } else {
            return null;//si no existe el carrito en el array retorna null;
        }
    }

    //este metodo crea un nuevo carrito vacion y me retorna un id: 
    createCart=async()=>{
        const arrayCarts = await this.readCart();
        let newCart = {
            id: arrayCarts.length===0 ? 1 : arrayCarts[arrayCarts.length-1].id +1,
            time: fecha,
            cart:[],
        }
        arrayCarts.push(newCart);
        await fs.promises.writeFile(this.path,JSON.stringify(arrayCarts,null,2));
        return newCart.id; //retorna del nuevo carrito el ID asignado;
    }
    //me devuelve un carrito por ID,
    getCartById=async(idCart)=>{
        const arrayCarts = await this.readCart();//leo el json de carritos
        const existCart = arrayCarts.some(item=>item.id === parseInt(idCart));//busco el carrito por ID.
        if (existCart == true) return arrayCarts.find(cart=>cart.id === parseInt(idCart));// si existe me devuelva el objeto.
        else return null; //sino que me retorne null
    }
    //elimino un carrito por id del arreglo de carritos;
    clearCartById=async(idCart)=>{
        const arrayCarts = await this.readCart();
        const existCart = await this.existCartId(idCart); //verifica si el carrito con el id recibido existe.
        if (existCart == true) {
            const newArrayCarts = arrayCarts.map(arr=>{
                if (arr.id === parseInt(idCart)){//accedo al array del carrito por su ID;
                    arr.cart = [];//al arreglo que tenia le igualo a un arreglo vacio.s
                }
                return arr;
            });
            await fs.promises.writeFile(this.path,JSON.stringify(newArrayCarts,null,2));
            return true;
        } else {
            return false;
        }
    }

    //elimina un producto en el carrito de acuerdo al ID que reciba como parametro,los mismos ingresan ya con todas las validaciones.
    deleteProductAtCart=async(idCart,idProduct)=>{
        const data = await this.readCart();//traigo los datos del archivo JSON.
        const newData = data.map(carts=>{ 
            if (carts.id === parseInt(idCart)) { //si el ID del carrito es igual al que me envian por params
                carts.cart = carts.cart.filter(item=>item.id !== parseInt(idProduct));//filtro los productos con id distinto al que me envian por params.
            }
            return carts;
        })
        await fs.promises.writeFile(this.path,JSON.stringify(newData,null,2));
    }

    //agrego un producto al carito con si id y la cantidad
    addProductAtCart=async(idCart,idProduct)=>{
        const arrayCart = await this.readCart();//leo el arreglo de carritos.
        //recorro con un map el array de carritos.
        const newArrayCarts = arrayCart.map(allCarts=>{
            if (allCarts.id === parseInt(idCart)) {
                //si existe ya el producto en el carrito,le aumento la cantidad.sino lo pusheo y la cantidad sea 1.
                if (allCarts.cart.some(prod=>prod.id === parseInt(idProduct))) {
                    let prodExist = allCarts.cart.find(item=>item.id === parseInt(idProduct))
                    prodExist.cantidad ++; //busco al producto en el carrito y le sumo la cantidad.
                } else{
                    allCarts.cart.push({id:parseInt(idProduct),cantidad:1});//sino lo crea con su id y cantidad.
                }
            }
            return allCarts;
        })
        await fs.promises.writeFile(this.path,JSON.stringify(newArrayCarts,null,2));
    }
}

export default CartContainer;