import { schema } from "normalizr";


//creo las entidades del objeto de acuerdo al arreglo de chats.
const user = new schema.Entity('usuario');

const message = new schema.Entity('mensaje',{    
    author:user
},{idAttribute:"_id"})
const messagesSchema = new schema.Entity('mensajes',{
    mensajes:[message]
})


export default messagesSchema;