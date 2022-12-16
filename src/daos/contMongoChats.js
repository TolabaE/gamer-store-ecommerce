
class ContainerMongoChats{
    constructor(schemaModel){
        this.collection = schemaModel;
    }
    //me tare todos los datos de la base de mongo.
    getAll = async()=>{
        return await this.collection.find({});
    }
    //guardar el chats de mensajes en la base de datos.
    save = async(objeto)=>{
        await this.collection.create(objeto)
    }
}

export default ContainerMongoChats;