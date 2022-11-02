import express from 'express';
import routerproductos from './router/productos.routes.js';

const app = express();
const server = app.listen(8080,()=>console.log('listening to server'));

app.get('/',(req,res)=>{
    res.send("hola servidor,esta es la entrega del desafio API RESTful")
})

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended:true })); // Habilita poder procesar y parsear datos más complejos en la url

app.use('/api/productos',routerproductos);
