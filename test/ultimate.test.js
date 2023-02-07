import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;//analiza los resultados que son recidas una vex realizadas todas las pruebas.
const requester = supertest('http://localhost:8080');

describe('Testeando el servidor de mi proyecto de backe-end', () => {
    describe('test de productos', () => {
        it('test para agregar un nuevo producto en la ruta del formulario de carga y subida a la base mongo', async() => {
            //construyo un objeto que es lo que voy a mandar para realizar la prueba.
            const newProduct = {
                nombre:"Parlante Bluetooth",
                marca:"JBL Flip 5 gris",
                precio:37900,
                image:"https://www.digitarinformatica.com.ar/wp-content/uploads/2022/04/Parlante-bluetooth-JBL-Flip-5-gris-20w-1.jpg",
                stock:34,
            }
            const response = await requester.post('/datos').send(newProduct);
            // expect(response.status).to.be.equal(200)
            expect(response._body).to.have.property('status')
        });

        it('Un test para verificar si se puede registrar un nuevo usario a la base de datos', async() => {
            const user = {
                first_name:"juan",
                last_name:"pedro",
                email:"juan@gmail.com",
                password:"2023",
                cart_ID:"",
            }
            const result = await requester.post('/api/session/register')
            .field('first_name',user.first_name)
            .field('last_name',user.last_name)
            .field('email',user.email)
            .field('password',user.password)
            .field('cart_ID',user.cart_ID)
            .attach('image','./test/gruimagen.jpg')

            expect(result.status).to.be.eql(200)
            expect(result._body).to.have.property('status')
        });
        //al registrarlo por segunda vez ya no me devuelve el status 200,porque el usuario ya existe en la base de datos.

        it('esta prueba de debe devolver de la base de datos a los carrito con sus respectivos productos', async() => {
            const response = await requester.get('/api/cart')
            expect(response._body).to.have.property('payload')
        });
        
        it('obtengo el arreglo de productos que me retorna al hacer una peticion get a la base mongo', async() => {
            const response = await requester.get('/productos')
            expect(response._body).to.have.property('status')
            expect(response._body).to.have.property('payload')
        });
        
    });
    
});
