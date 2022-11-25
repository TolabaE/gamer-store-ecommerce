import knex from "knex";
import __dirname from "../utils.js";

const sqliteOptions = {
    client: 'sqlite3',
    connection: { 
        filename: __dirname+'/data/ecommers.sqlite' 
    },
    useNullAsDefault:true,
}

const db = knex(sqliteOptions)

try {
    const exist = await db.schema.hasTable('products');
    if (!exist) {
        await db.schema.createTable('products',table=>{
            table.increments('id').primary(),
            table.string('nombre',25).notNullable(),
            table.string('marca',20).notNullable(),
            table.string('image',1000),
            table.integer('stock'),
            table.integer('precio').notNullable()
            table.string('data',20)
        })
    }
} catch (error) {
    console.log(error);
}

try {
    const exist = await db.schema.hasTable('chats');
    if (!exist) {
        await db.schema.createTable('chats',table=>{
            table.increments('id').primary(),
            table.string('usuario',30).notNullable(),
            table.string('mensaje',200).notNullable(),
            table.string('time')
        })
    }
} catch (error) {
    console.log(error);
}

export default sqliteOptions;