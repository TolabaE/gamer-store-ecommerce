'use strict';
import knex from "knex";

class ContainerSQL {
    constructor(database,table){
        this.knex = knex(database);
        this.table = table ;
    }
    //me trae todos los productos en un arreglo.
    getAll=async()=>{
        try {
            return await this.knex.select('*').from(this.table);
        } catch (error) {
            console.log(error);
        }
    }
    //me trae un producto de la basedatos de acuerdo al ID que reciba como parametro.
    getById=async(getId)=>{
        try {
            return await this.knex.select('*').from(this.table).where('id','=',parseInt(getId));
        } catch (error) {
            console.log(error);
        }
    }
    //guarda un nuevo producto en nuestra base de datos.
    save=async(newproducts)=>{
        try {
            await this.knex.insert(newproducts).into(this.table);
        } catch (error) {
            console.log(error);
        }
    }
    //elimina un productos por id;
    deleteById=async(idelete)=>{
        try {
            await this.knex.delete().from(this.table).where('id','=',idelete);
        } catch (error) {
            console.log(error);
        }
    }
    //elimina todos los productos de la tabla.
    deleteAll=async()=>{
        try {
            await this.knex.from(this.table).where('id','=','*').del();
        } catch (error) {
            console.log(error);
        }
    }
    //este metodo actualiza un producto(recibe dos paramtros el ID a actulizar y el nuevo producto).
    updateProduct=async(product,id)=>{
        try {
            await this.knex.from(this.table).where('id','=',id).update(product)
        } catch (error) {
            console.log(error);
        }
    }

}

export default ContainerSQL;