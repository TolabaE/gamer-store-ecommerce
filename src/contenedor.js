"use strict";
import fs from 'fs';

class Contenedor{
    constructor(direction){
        this.direction = direction;//creo el json aparti de la ruta que me envien
    }
    //este metodo guarda un nuevo objeto en el array y le agrega un Id propio.
    save=async(objeto)=>{
        const array = await this.getAll();//me trae los datos del json si hay algo,sino me devuelve un arreglo vacio.
        if (array.length>0) {
            const id =array[array.length-1].id + 1;
            objeto.id = id;
        }else {
            objeto.id = 1;
        }
        array.push(objeto);
        await fs.promises.writeFile(this.direction,JSON.stringify(array,null,2))
    }
    //trae todos los productos que se encuentran en el array,o sino te dice que esta vacio.
    getAll=async()=>{
        if (fs.existsSync(this.direction)) {
            const data = await fs.promises.readFile(this.direction,'utf-8');
            return  JSON.parse(data);
        }else {
            return [];
        }
    }
    //este codigo nos devuelve un producto que sea igual al ID que nos enviaron o retorna null si no lo encuentra.
    getById=async(numeroId)=>{
        const arraydatos = await this.getAll();//uso el metodo getAll para traerme los datos.
        if (arraydatos.some(prod=>prod.id===parseInt(numeroId))) {
            return arraydatos.find(prod=>prod.id===parseInt(numeroId));//el metodo find busca el producto con ese ID.
        }else{
            return (null);
        }
    }
    //elimina un producto del JSON si lo encuentra,si no lo encuentra retorna null.
    deleteById=async(deleteId)=>{
        let arrayCompras=[];//creo un array vacio
        const archivos = await this.getAll();//uso el metodo getAll para traerme los datos.
        if (archivos.some(item=>item.id === parseInt(deleteId))) {
            //este codigo filtra los datos distintos al id que me enviaron y reescribe el codigo.
            arrayCompras = archivos.filter(item=>item.id !== parseInt(deleteId));
            await fs.promises.writeFile(ruta,(JSON.stringify(arrayCompras,null,2)));
        } else {
            return null;
        }
    }
    //elimina todos los productos que estan en el JSON.
    deleteAll=async()=>{
        const arrayVacio=[]
        await fs.promises.writeFile(this.direction,JSON.stringify(arrayVacio,null,2));
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
            await fs.promises.writeFile(this.direction,(JSON.stringify(arreglo,null,2)));
        } else {
            return null;
        }
    }
}

export default Contenedor;