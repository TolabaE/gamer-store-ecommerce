"use strict";
import fs from 'fs';
import __dirname from './utils.js';

const producto1={
    nombre:"televisor",
    marca:"samsung",
    precio:54000,
    imagen:"https://smasungtelevisor-0000-DIA-1-Kg-_1.jpg?v=637699739334400000"
}
const producto2={
    nombre:"aire acondicionado",
    marca:"Philco",
    precio:150900,
    imagen:"https://uiseros--46224.jpg?v=636383732923400000"
}
const producto3={
    nombre:"licuadora",
    marca:"liqueitor",
    precio:10200,
    imagen:"https://http2.mlstatic.com/D_NQ_NP_765860-MLA42858337222_072020-V.jpg"
}
const producto4={
    nombre:"microondas",
    marca:"samsung",
    precio:111999,
    imagen:"https://http2.mlstatic.com/D_NQ_NP_765860-MLA42858337222_072020-V.jpg"
}
const producto5={
    nombre: "lavarropas",
    marca: "dream",
    precio: 105000,
    imagen: "/imagen/fravega/lavarropas.jpg"
}

const ruta = `${__dirname}/productos.json`;

class Contenedor{
    constructor(nombre){
        this.nombre=nombre;
    }

    //este metodo guarda un nuevo objeto en el array y le agrega un Id propio.
    save=async(objeto)=>{
        let arrayproductos=[];
        try {
            if (fs.existsSync(ruta)) {
                const datos = await fs.promises.readFile(ruta,'utf-8');
                arrayproductos = JSON.parse(datos);
                const id =arrayproductos.length +1;
                objeto.id = id;
            } else {
                objeto.id = 1;
            }
            arrayproductos.push(objeto);
            await fs.promises.writeFile(ruta,JSON.stringify(arrayproductos,null,2))
        } catch (error) {
            console.log(error);
        }
    }

    //trae todos los productos que se encuentran en el array,o sino te dice que esta vacio.
    getAll=async()=>{
        try {
            const data = await fs.promises.readFile(ruta,'utf-8');
            if (data.length >= 0) {
                return  JSON.parse(data);//si el array es mayor a la longitud 0 devolveme la data sino retorna un array vacio.
            } else {
                return [];
            }
        } catch (error) {
            console.log('error de lectura'+ error);
        }
    }

    //este codigo nos devuelve un producto que sea igual al ID que nos enviaron o retorna null si no lo encuentra.
    getById=async(numeroId)=>{
        try {
            const arraydatos = await this.getAll();//uso el metodo getAll para traerme los datos.
            if (arraydatos.some(prod=>prod.id===parseInt(numeroId))) {
                return arraydatos.find(prod=>prod.id===parseInt(numeroId));//el metodo find busca el producto con ese ID.
            }else{
                return (null);
            }
        } catch (error) {
            console.log(error);
        }
    }

    //elimina un producto del JSON si lo encuentra,si no lo encuentra retorna null.
    deleteById=async(deleteId)=>{
        let arrayCompras=[];//creo un array vacio
        try {
            const archivos = await this.getAll();//uso el metodo getAll para traerme los datos.
            if (archivos.some(item=>item.id === parseInt(deleteId))) {
                //este codigo filtra los datos distintos al id que me enviaron y reescribe el codigo.
                arrayCompras = archivos.filter(item=>item.id !== parseInt(deleteId));
                await fs.promises.writeFile(ruta,(JSON.stringify(arrayCompras,null,2)));
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
        }
    }
    //este metodo recibe dos parametros el id y el objeto.
    updateById = async(idurl,newproduct)=>{
        const datos = await this.getAll();
        if (datos.some(ele=>ele.id === parseInt(idurl))) {
            const arreglo = datos.filter(pro=>pro.id !== parseInt(idurl));//filtro al item con ese ID,
            newproduct.id = parseInt(idurl);//luego reemplazo el nuevo producto con ese ID, 
            arreglo.push(newproduct);//pusheo el nuevo objeto con el ID al array.
            arreglo.sort((item1,item2)=>item1.id-item2.id);//este metodo me ordena el array de productos.
            await fs.promises.writeFile(ruta,(JSON.stringify(arreglo,null,2)));
        } else {
            return null;
        }
    }
}

export default Contenedor;