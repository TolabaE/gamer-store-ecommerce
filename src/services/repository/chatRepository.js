import GenericRepository from "./genericRepository.js";
import Chats from "../../dao/mongodb/models/chats.model.js";

export default class ChatRepository extends GenericRepository{
    constructor(dao){
        super(dao,Chats.model)
    }
}