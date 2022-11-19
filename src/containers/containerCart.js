"use strick";
import fs from 'fs';

const fecha = new Date().toDateString();

class CartContainer{
    constructor(path){
        this.path = path;
        this.init();
    }
    init = async()=>{
        if (!fs.existsSync(this.path)) {
            await fs.promises.writeFile(this.path,JSON.stringify([]));
        }
    }
    readFileCart = async()=>{
        const arrayData = await fs.promises.readFile(this.path,'utf-8');
        return JSON.parse(arrayData);
    }
    existCartId=async(idexist)=>{
        const data = await this.readFileCart();
        return data.some(cart => cart.id === parseInt(idexist));
    }
    //este metodo crea un nuevo carrito vacion y me retorna un id: 
    createCart=async()=>{
        const arrayCarts = await this.readFileCart();
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
        const arrayCarts = await this.readFileCart();//leo el json de carritos
        const existCart = await this.existCartId(idCart);//busco el carrito por ID.
        if (existCart === true) {
            return arrayCarts.find(cart=>cart.id ===parseInt(idCart));
        } else {
            return false;
        }
    }
    //elimino un carrito por id del arreglo de carritos;
    deleteCartById=async(idCart)=>{
        const arrayCarts = await this.readFileCart();
        const existCart = await this.existCartId(idCart); //verifica si el carrito con el id recibido existe.
        if (existCart == true) {
            const newArrayCarts = arrayCarts.filter(arr=> arr.id !== parseInt(idCart));
            await fs.promises.writeFile(this.path,JSON.stringify(newArrayCarts,null,2));
            return true;
        } else {
            return false;
        }
    }
    deleteProductAtCart=async(idCart,idProduct)=>{
        const data = await this.readFileCart();
        const cartIndex = data.findIndex(cart=>cart.id === parseInt(idCart));//busco el indice del el carrito a manipular.
        const carrito = data[cartIndex]; 
        //obtengo el el indice en el array y a eso lo guardo en una constante que me retorna al carrito.
        const status = carrito.cart.some(item=>item.id === parseInt(idProduct));
        if (status === true) {
            const newData = data.map(carts=>{ 
                //si de los carritos.id es igual al que me envian por parametro.
                if (carts.id === parseInt(idCart)) {
                    carts.cart = carts.cart.filter(item=>item.id !== parseInt(idProduct));
                }
                return carts;
            })
            await fs.promises.writeFile(this.path,JSON.stringify(newData,null,2));
        }else{
            return false
        }
    }
    //
    addProductAtCart=async(idCart,idProduct)=>{
        const arrayCart = await this.readFileCart();//leo el arreglo de carritos.
        //recorro con un map el array de carritos.
        const newArrayCarts = arrayCart.map(allCarts=>{
            //me retorno true si el producto existe en el carrito sino me retorna false.
            const existProducts = allCarts.cart.some(pro=>pro.id === parseInt(idProduct));
            if (allCarts.id === parseInt(idCart)) {
                //si existe ya el producto en el carrito,le aumento la cantidad.sino lo pusheo y la cantidad sea 1.
                if (existProducts === true) {
                    //busco al producto en el carrito y le sumo la cantidad.
                    let prodExist = allCarts.cart.find(item=>item.id === parseInt(idProduct))
                    prodExist.cantidad ++;
                } else{
                    allCarts.cart.push({id:parseInt(idProduct),cantidad:1});
                }
            }
            return allCarts;
        })
        await fs.promises.writeFile(this.path,JSON.stringify(newArrayCarts,null,2));
    }

}

export default CartContainer;