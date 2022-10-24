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
                const id =arrayCompras.length +1;
                objeto.id = id;
                arrayCompras.push(objeto);
                await fs.promises.writeFile(ruta,JSON.stringify(arrayCompras,null,2))
                console.log(`el numero de ID asignado es ${objeto.id}`);
            } else {
                objeto.id = 1;
                arrayCompras.push(objeto)
                await fs.promises.writeFile(ruta,JSON.stringify(arrayCompras,null,2));
                console.log(`el numero de ID asignado es ${objeto.id}`);
            }
        } catch (error) {
            console.log(error);
        }
    }
    getById=async(numeroId)=>{
        try {
            const leerDatos = await fs.promises.readFile(ruta,'utf-8');
            arrayCompras=JSON.parse(leerDatos);
            if (arrayCompras.length>=numeroId) {
                const itemEncontrado = arrayCompras.find(prod=>prod.id==numeroId);
                console.log(itemEncontrado);
            }else{
                console.log("no tiene un producto con ese ID asignado");
            }
        } catch (error) {
            console.log(error);
        }
    }
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
    deleteById=async(deleteId)=>{
        try {
            const getData = await fs.promises.readFile(ruta,'utf-8');
            const archivos = JSON.parse(getData);
            if (archivos.length >= deleteId) {
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

//el usuario compra los productos y los guarda en el json devuelve el id del producto
usuarioComprador.save(producto3);

//devuelve el objeto con el ID enviado o de lo contrario te dice que no existe.
usuarioComprador.getById("2");
usuarioComprador.getById("5");

//devuelve todos los productos o de lo contrario nos avisa que no tenemos productos.
usuarioComprador.getAll();

//este metodo le permite al usuario eliminar algun producto de su array.
usuarioComprador.deleteById("4");
usuarioComprador.deleteById("8");

//elimina todos los archivos.
// usuarioComprador.deleteAll();