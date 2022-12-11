import express from 'express';
import routerviews from './router/views.routes.js';
import apiProductsRouter from './router/api.products.routes.js';
import apiCartsRouter from './router/api.cart.routes.js';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import mySQLRouter from './router/product.sqlite3.routes.js';
import ContainerSQL from './daos/containerSqlite.js';
import db from './data/knex.js';//importo la base de datos para trabajar.
import ContainerDAOs from './daos/index.js';


const app = express();
const server = app.listen(8080,()=>console.log('listening to server'));

// configuramos el servidor para usar la plantilla de ejs.
app.set('views',__dirname+'/views');
app.set('view engine','ejs');

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended:true })); // Habilita poder procesar y parsear datos más complejos en la url

app.use(express.static(__dirname + "/public"));//hace publico los archivos que estan en la carpeta para entrar de manera directa.
app.use('/',routerviews);
app.use('/api/products',apiProductsRouter);
app.use('/api/cart',apiCartsRouter);
app.use('/sqlite/products',mySQLRouter);


//desestructuro del DAOs.
const {ManagerProduct} = ContainerDAOs;

//conectamos nuestro servidor con el servidor de io.
const io = new Server(server);


// const conversacion = new Contenedor(__dirname+'/json/historial.json');

//llamo al constructor de sqlite,para que el chats se guarde en la base de datos.
const containerSqliteChats = new ContainerSQL(db,'chats');
// const containerSqliteProducts = new ContainerSQL(db,'products');

//para ver el historial del chats de la base de datos sqlite3.
app.get('/sqlite/chats',async(req,res)=>{
    const chat = await containerSqliteChats.getAll();
    res.send(chat)
})



io.on('connection',async(socket)=>{
    console.log('socket connected');

    const data = await ManagerProduct.getAll();//lee el array de productos que puede ser de la base mongo o del Json.
    io.emit('arrayProductos',data);//emito el JSON al servidor para que lo vean todos

    // const historial = await conversacion.getAll();//llamo el historial de chats de lo que habia
    const historial = await containerSqliteChats.getAll();//trae el historial de chats que esta en la base de datos sqlite3.
    socket.emit('arraychats',historial);

    socket.on('message',async(data)=>{//recibo el mensaje que me enviaron.
        // await conversacion.save(data); //guardo en mi json.
        // const chats = await conversacion.getAll();// llamo mi historial de chat
        await containerSqliteChats.save(data);
        const chats = await containerSqliteChats.getAll();
        io.emit('arraychats',chats);
    })
    socket.on('registrado',user=>{
        socket.broadcast.emit('newuser',user)
    })
});