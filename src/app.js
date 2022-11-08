import express from 'express';
import routerproductos from './router/productos.routes.js';
import __dirname from './utils.js';

const app = express();
const server = app.listen(8080,()=>console.log('listening to server'));
// configuramos el servidor para usar la plantilla de ejs.
app.set('views',__dirname+'/views');
app.set('view engine','ejs');

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended:true })); // Habilita poder procesar y parsear datos más complejos en la url

app.use(express.static(__dirname + "/public"));//hace publico el archivo
app.use('/',routerproductos);