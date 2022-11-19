import express from 'express';
import routerviews from './router/views.routes.js';
import apiProductsRouter from './router/api.products.routes.js';
import apiCartsRouter from './router/api.cart.routes.js';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import Contenedor from './containers/container.js';

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

//conectamos nuestro servidor con el servidor de io.
const io = new Server(server);
//creo una nuevo construuctor y apartir de alli traigo los archivos que estan en mi array.
const archivo = new Contenedor(__dirname+'/json/productos.json');
const conversacion = new Contenedor(__dirname+'/json/historial.json');


io.on('connection',async(socket)=>{
    console.log('socket connected');

    const data = await archivo.getAll();//lee los archivos que estan en el JSON.
    io.emit('arrayProductos',data);//emito el JSON al servidor para que lo vean todos

    const historial = await conversacion.getAll();//llamo el historial de chats de lo que habia
    socket.emit('arraychats',historial);

    socket.on('message',async(data)=>{//recibo el mensaje que me enviaron.
        await conversacion.save(data); //guardo en mi json.
        const chats = await conversacion.getAll();// llamo mi historial de chat
        io.emit('arraychats',chats);
    })
    socket.on('registrado',user=>{
        socket.broadcast.emit('newuser',user)
    })
});