import GenericRepository from "./genericRepository.js";
import Products from "../../dao/mongodb/models/products.model.js";

//exporto el modelo de productos de la carpeta dao.
export default class ProductRepository extends GenericRepository{
    constructor(dao){
        super(dao,Products.model)
    }
}