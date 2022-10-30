"use strict";
const fs = require('fs');

const producto1={
    title:"arroz",
    price:100,
    thumbnail:"https://ardiaprod.vtexassets.com/arquivos/ids/212949/Arroz-Largo-Fino-0000-DIA-1-Kg-_1.jpg?v=637699739334400000"
}
const producto2={
    title:"fideos",
    price:130,
    thumbnail:"https://jumboargentina.vtexassets.com/arquivos/ids/209822/Fideo-Molto-Guiseros-Fideos-Guisero-Molto-500-Gr-1-46224.jpg?v=636383732923400000"
}
const producto3={
    title:"harina",
    price:150,
    thumbnail:"https://http2.mlstatic.com/D_NQ_NP_765860-MLA42858337222_072020-V.jpg"
}
const producto4={
    title:"azucar",
    price:120,
    thumbnail:"https://http2.mlstatic.com/D_NQ_NP_765860-MLA42858337222_072020-V.jpg"
}
const ruta = './productoscomprados.json';

let arrayCompras=[]
class Contenedor{
    constructor(nombre){
        this.nombre=nombre;
    }
    save=async(objeto)=>{
        try {
            if (fs.existsSync(ruta)) {
                const datos = await fs.promises.readFile(ruta,'utf-8');
                arrayCompras = JSON.parse(datos);
                const id =arrayCompras[arrayCompras.length-1].id + 1;
                objeto.id = id;
            } else {
                objeto.id = 1;
            }
            arrayCompras.push(objeto);
            await fs.promises.writeFile(ruta,JSON.stringify(arrayCompras,null,2))
            console.log(`el numero de ID asignado es ${objeto.id}`);
        } catch (error) {
            console.log(error);
        }
    }
    getById=async(numeroId)=>{
        try {
            const leerDatos = await fs.promises.readFile(ruta,'utf-8');
            arrayCompras=JSON.parse(leerDatos);
            if (arrayCompras.some(prod=>prod.id==numeroId)) {
                const itemEncontrado = arrayCompras.find(prod=>prod.id==numeroId);
                console.log(itemEncontrado);
            }else{
                console.log("no tiene un producto con ese ID asignado");
            }
        } catch (error) {
            console.log(error);
        }
    }
    //trae todos los productos que se encuentran en el array,o sino te dice que esta vacio.
    getAll=async()=>{
        try {
            const data = await fs.promises.readFile(ruta,'utf-8');
            arrayCompras = JSON.parse(data);
            if (arrayCompras.length >= 1) {
                console.log(arrayCompras);
            } else {
                console.log('no tiene productos agregados al carrito');
            }
        } catch (error) {
            console.log('error de lectura'+ error);
        }
    }
    //elimina un producto del JSON si lo encuentra,
    deleteById=async(deleteId)=>{
        try {
            const getData = await fs.promises.readFile(ruta,'utf-8');
            const archivos = JSON.parse(getData);
            if (archivos.some(item=>item.id === parseInt(deleteId))) {
                arrayCompras = archivos.filter(item=>item.id !== parseInt(deleteId));
                await fs.promises.writeFile(ruta,(JSON.stringify(arrayCompras,null,2)));
                console.log(`el producto con el ID: ${deleteId} a sido eliminado `);
            } else {
                console.log(`no existe el producto con el ID:${deleteId} que desea eliminar`);
            }
        } catch (error) {
            console.log(error);
        }
    }
    //elimina todos los productos que estan en el JSON.
    deleteAll=async()=>{
        const arrayVacio=[]
        try {
            await fs.promises.writeFile(ruta,JSON.stringify(arrayVacio,null,2));
            console.log('los productos fueron remivos, eliminacion completada :),¡vuelve a comprar¡');
        } catch (error) {
            console.log(error);
        }
    }
}
//ejecutando todos los metodos,creando un usuario.
const usuarioComprador = new Contenedor ('Eduardo');

const ejecutandoMetodos = async()=>{

    //el usuario compra los productos y los guarda en el json devuelve el id del producto
    await usuarioComprador.save(producto1);
    await usuarioComprador.save(producto2);
    await usuarioComprador.save(producto3);
    await usuarioComprador.save(producto4);

    //devuelve el objeto con el ID enviado o de lo contrario te dice que no existe.
    await usuarioComprador.getById("2");
    await usuarioComprador.getById("5");

    //devuelve todos los productos o de lo contrario nos avisa que no tenemos productos.
    await usuarioComprador.getAll();

    //este metodo le permite al usuario eliminar algun producto de su array.
    await usuarioComprador.deleteById("3");
    await usuarioComprador.deleteById("5");
}

//esta funcion elimina todos los productos del JSON.
const eliminarArchivo = async()=>{
    await usuarioComprador.deleteAll();
}
ejecutandoMetodos();