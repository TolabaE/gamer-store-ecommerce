import GenericRepository from "./genericRepository.js";
import Users from "../../dao/mongodb/models/user.model.js";

//creo los metodos propios del repositorio de usarios,pero que use un extendido de los metodos del genericRepository.
export default class UserRepository extends GenericRepository {
    constructor(dao){
        super(dao,Users.model)
    }
}