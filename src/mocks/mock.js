import { faker } from "@faker-js/faker";

faker.locale = 'es';//me trae los datos en español.

const productoFaker = ()=> {
    return {
        id:faker.database.mongodbObjectId(),
        nombre:faker.commerce.product(),
        precio:faker.commerce.price(100, 900, 0, '$'),//crea un precio aleatorio de entre 100 y los 900 y que sea entero.
        imagen:faker.image.business(),//retorna una imagen aleatorio.
        stock:faker.commerce.price(1,30,0)
    }
}
// creo un arreglo vacio que es donde se va a exportar los productos generados al azar
const arrayFaker = []

for (let index = 0; index < 6; index++) {
    arrayFaker.push(productoFaker());
}

//este arreglo es exportado a la carpeta router/views.router.js
export default arrayFaker;