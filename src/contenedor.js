"use strict";
import fs from 'fs';
import __dirname from './utils.js';

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
        parseInt(idurl);//parseo el id que me envian por url
        if (datos.some(ele=>ele.id === idurl)) {
            const arreglo = datos.filter(pro=>pro.id !== idurl);//filtro al item con ese ID,
            newproduct.id = idurl;//luego reemplazo el nuevo producto con ese ID, 
            arreglo.push(newproduct);//pusheo el nuevo objeto con el ID al array.
            arreglo.sort((item1,item2)=>item1.id-item2.id);//este metodo me ordena el array de productos.
            await fs.promises.writeFile(ruta,(JSON.stringify(arreglo,null,2)));
        } else {
            return null;
        }
    }
}

export default Contenedor;