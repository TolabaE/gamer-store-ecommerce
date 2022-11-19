"use strict";
import fs from 'fs';
const fecha = new Date()
class Contenedor{
    constructor(direction){
        this.direction = direction;
        this.init();
    }
    //crea el JSON como un array vacio.cuando se inicia el contenedor.
    init=async()=>{
        if (!fs.existsSync(this.direction)) {
            await fs.promises.writeFile(this.direction,JSON.stringify([]));
        }
    }
    //lee archivo json y me devuelve los datos parseados.
    readFile=async()=>{
        const datos = await fs.promises.readFile(this.direction,'utf8');
        return JSON.parse(datos);
    }

    getAll=async()=>{ //trae todos los productos que se encuentran en el array.
        return await this.readFile();
    }
    //este metodo guarda un nuevo objeto en el array y le agrega un Id propio.
    save=async(objeto)=>{
        const array = await this.readFile();
        if (array.length>0) {
            objeto.id = array[array.length-1].id + 1;
        }else {
            objeto.id = 1;
        }
        objeto.code = parseInt(Math.random()*10000000),
        objeto.timestamp = new Date();
        array.push(objeto);
        await fs.promises.writeFile(this.direction,JSON.stringify(array,null,2))
    }

    existsFile= async(idparam)=>{
        const arreglo = await this.readFile();
        return arreglo.some(prod =>prod.id === parseInt(idparam));//si el ID del objeto existe me retorna true o false.
    }
    //este codigo nos devuelve un producto que sea igual al ID que nos enviaron o retorna null si no lo encuentra.
    getById=async(numeroId)=>{
        const arraydatos = await this.readFile();
        const state= await this.existsFile(numeroId)
        if (state === true) {
            return arraydatos.find(prod=>prod.id===parseInt(numeroId));//el metodo find busca el producto con ese ID.
        }else{
            return null;
        }
    }
    //elimina un producto del JSON si lo encuentra,si no lo encuentra retorna null.
    deleteById=async(deleteId)=>{
        const archivos = await this.readFile();//uso el metodo readFile() para traerme los datos.
        const condition = await this.existsFile(deleteId);//si el objeto existe me devuelve true,sino false.
        if (condition === true) {
            const arrayproducts = archivos.filter(item=>item.id !== parseInt(deleteId));
            await fs.promises.writeFile(this.direction,JSON.stringify(arrayproducts,null,2));
            return true;
        } else {
            return null;
        }
    }
    //elimina todos los objetos del array
    deleteAll=async()=>{
        await fs.promises.writeFile(this.direction.JSON.stringify([]));
    }
    //este metodo recibe dos parametros el id y el objeto y actualiza un objeto del array
    updateById = async(idurl,newproduct)=>{
        const datos = await this.readFile();
        const state = await this.existsFile(idurl);
        const Id = parseInt(idurl);
        if (state === true) {
            const array = datos.filter(pro=>pro.id !== Id);//filtro el arreglo con id distinto al que me enviaron.
            newproduct.id = Id;//reemplazo el nuevo producto con ese ID, 
            array.push(newproduct);//pusheo el nuevo objeto con el ID al array.
            array.sort((item1,item2)=>item1.id-item2.id);//este metodo me ordena el array de productos.
            await fs.promises.writeFile(this.direction,JSON.stringify(array,null,2));
            return true;
        } else {
            return false;
        }
    }
}

export default Contenedor;