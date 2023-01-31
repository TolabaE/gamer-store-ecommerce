import express from 'express';
import routerviews from './router/views.routes.js';
import apiProductsRouter from './router/api.products.routes.js';
import apiCartsRouter from './router/api.cart.routes.js';
import sessionRouter from './router/api.session.routes.js';
import __dirname from './utils.js';
import { Server } from 'socket.io';
// import ContainerDAOs from './daos/index.js';
// import ContainerMongoChats from './daos/contMongoChats.js';
// import chatModel from './models/chats.js';
import { chatService , productService } from './services/services.js';
import dotenvConfig from './config/dotenv.config.js';
//importamos estos paquetes para poder crear nuestra session.
import session from 'express-session';
import MongoStore from 'connect-mongo';//nos permite concetarnos a nuestra base de mongo.
import cookieParser from 'cookie-parser';

//importo el passport y el metodo de inizialicion.
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import flash from 'connect-flash';//es un modulo que nos permite conectar el envio recibo de mensajes entre multiples pag.
import addLoggers from './middlewares/logger.js';//importo la funcion para poder usar los distintos loggers en mi aplicativo.
//importamos el cluster para poder trabajar.
import minimist from 'minimist';
import cluster from 'cluster';
import os from 'os';

//usamos minimist para poder traer los argumentos que son pasados por consola, por default se inicia en modo fork().
const { m } = minimist(process.argv.slice(2), { default:{m: "fork"} });

const app = express();
export const PORT = process.env.PORT || 8080; // usa el puerto 8080 en caso de que no tenga uno.
const CPUs = os.cpus().length;
let server 


//si me pasan por paramtro el nombre cluster,entonces ejecuto el servidor en modo cluster.
if (m === "cluster") {
	if (cluster.isPrimary) {
		console.log(`proceso primario con pid ${process.pid}`);
		for (let i = 0; i < CPUs; i++) {
			cluster.fork();
		}
		cluster.on("exit", (worker) => {
			console.log(`el proceso con el pid ${worker.process.pid} a finalizado`);
			cluster.fork();
		});
	} else {
		console.log(`proceso worker con pid ${process.pid}`);
		app.listen(PORT, console.log("servidor escuchando en modo cluster"));
	}
	//sino por defecto si no me pasan ningun parametro ejecuto en modo fork.
} else if (m === "fork") {
	server = app.listen(PORT, console.log(`servidor escuchando en modo fork en puerto:${PORT}`));
}


// configuramos el servidor para usar la plantilla de ejs.
app.set('views',__dirname+'/views');
app.set('view engine','ejs');

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({extended:true})); //Habilita poder procesar y recibir datos más complejos en la url como archivos.
app.use(addLoggers);//uso la funcion como middlewear,para que este disponible en todo mi aplicativo.

// configuramos la conexion de la session con mongo atlas aqui.
app.use(session({
    store:MongoStore.create({
        mongoUrl:`mongodb+srv://${dotenvConfig.mongo.USER}:${dotenvConfig.mongo.PWD}@codercluster0.nvobhct.mongodb.net/${dotenvConfig.mongo.DB}?retryWrites=true&w=majority`,
        ttl:900,
    }),
    secret:`${dotenvConfig.session.SECRET}`,
    resave:false,
    saveUninitialized:false,
}))

app.use(flash());//seteo al flash como un middlewear.
initializePassport()//inizializa las estrategias de passport.
app.use(passport.initialize())//inizializa el corazon de passport
app.use(passport.session())//esto le permite trabajar con el modelo de sessiones que tenga actualmente.
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));//hace publico los archivos que estan en la carpeta para entrar de manera directa.

// //seteo un nuevo middlewear para obtener los mensajes del req.flash();
// app.use((req,res,next)=>{
//     //obtengo el mensaje y lo almaceno de forma local para que este disponible ne todo mi aplicativo.
//     app.locals.messageRegister = req.flash('messageRegister');
//     next();//para que continue con el resto de las peticiones,sino se queda estancado.
// })

//routes
app.use('/',routerviews);
app.use('/api/session',sessionRouter);
app.use('/api/products',apiProductsRouter);
app.use('/api/cart',apiCartsRouter);

//creo una metodo para todas aquellas consultas que se realizen a rutas inexistentes. 
app.get('*',(req,res)=>{
    req.logger.warn(`la ruta ${req.url} esta siendo visitada por el metodo ${req.method} y no existe.`);
    res.send({status:"error",error:"la ruta que usted esta visitando no existe"});
})

app.get('/info',(req,res)=>{
    const data = {
        REPO:process.cwd(),
        TITLE:process.title,
        ARGV:process.argv,
        PID:process.pid,
        SystemOpe:process.plataform,
        VERSION:process.version,
        MEMORY:process.memoryUsage(),
    }
    req.logger.info(`el usuario a visitado la ruta ${req.url} con el metodo ${req.method}`)
    res.send({status:"success",payload:data})
})


//conectamos nuestro servidor con el servidor de io.
const io = new Server(server);


io.on('connection',async(socket)=>{
    console.log('socket connected');

    const data = await productService.getAll();//trae el array de productos que puede ser de la base mongoDB o del JSON.
    io.emit('arrayProductos',data);//emito el JSON al servidor para que lo vean todos

    //traigo los mensajes que habia en mi base mongoDB.
    const historial = await chatService.getAll();
    socket.emit('arraychats',historial);

    socket.on('message',async(data)=>{//recibo el mensaje que me enviaron.
        await chatService.saveObject(data);//guardo los mensajes en la base de mongoDB.
        const arrayMessages = await chatService.getAll();//traigo los datos de la base MongoDB
        io.emit('arraychats',arrayMessages);
    })
    socket.on('registrado',user=>{
        socket.broadcast.emit('newuser',user)
    })
});