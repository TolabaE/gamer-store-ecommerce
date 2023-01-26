'use strict'

const container = document.getElementById('container-cart');
const order = document.getElementById('container-order');
// const alertTitle = document.getElementById('title-cart-page');
let totalPrice = 0;

const updateTotalPriceCard = (usuario,precioTotal) =>{
    let insertOrder = "";
    insertOrder=`
        <div id="cardOrder" class="card-order">
            <h2>Factura de Compra</h2>
            <h4>N° de pedido:</h4>
            <p>Cliente: ${usuario}</p>
            <h3>Total:$ ${precioTotal}</h3>
            <button>Comprar</button>
        </div>
        `
    return order.innerHTML = insertOrder;//inserto el html en el DOM.
}

//hago una peticion a la ruta indicada en el fetch y me trae todos los productos que tenga el usuario agregado al carrito y los guardo en una funcion.
const getAllProductCart = async() =>{
    const get = await fetch('/api/cart');//pido los datos con un fetch.
    const data = await get.json();//parseo la data que me envian.
    return data;
}

getAllProductCart()
.then(result=>{
    //creo una condicion,que si el usuario no esta logeado no me muestre los productos que estan en el carrito.
    if (result.status === "error") {
        return Swal.fire({
            icon: 'error',
            title: `${result.error}`,
            text: 'inicia sesion para ver tu carrito de compras',
        })
    }

    if (result.payload.length === 0) {
        return Swal.fire({
                icon: 'info',
                title: `Carrito Vacio`,
                text: 'Debes agregar algun producto',
            })
    }

    const data = result.payload;//desestructuro el resultado para obtener el arreglo de productos.
    const cliente = result.client;//obtengo el nombre del cliente.
    let insertProducts = "";

    data.forEach(element => {
        totalPrice += element.precio*element.cantidad;
        insertProducts += `
        <div class="box-cart-children" id="${element.id}">
            <div>
                <img class="img-cart" src=${element.image} alt="">
            </div>
            <div class="detail-cart">
                <h3>${element.nombre}</h3>
                <h4>${element.marca}</h4>
                <h3>${element.cantidad}</h3>
                <h4>Total:$ ${element.precio*element.cantidad}</h4>
                <button>Eliminar</button>
            </div>
        </div>
        `;
        container.innerHTML = insertProducts;//inserto los productos en el DOM para que se muestre en la vista.
        updateTotalPriceCard(cliente,totalPrice);
    });

    data.forEach(element =>{
        const card = document.getElementById(`${element.id}`);//accedo a cada una de las cartas por el id del producto.
        //creo un evento que vacie a la card seleccionada del carrito,cuando hagan click al boton eliminar.
        card.children[1].children[4].addEventListener('click',()=>{

            fetch(`/api/cart/delete/${element.id}`,{
                method:'DELETE',
                headers:{'Content-type':'application/json'}
            })
            .then(response => response.json())
            .then(jsonResponse =>{

                Toastify({
                    text: `${jsonResponse.payload}`,
                    duration: 3000,
                    style: {
                        background: "linear-gradient(90deg, rgba(250,103,49,1) 4%, rgba(238,175,36,1) 95%)",
                    }
                }).showToast();
                card.innerHTML = "";//elimino la card del DOM
            })
        })
        updateTotalPriceCard(cliente,totalPrice);
    })

})


getAllProductCart()//llamo a la funcion asincronica para obtner los datos
.then(result =>{

    const array = result.payload;
    const user = result.client;//obtengo el nombre del cliente logeado
    updateTotalPriceCard(user,totalPrice);//llamo a la funcion que actualiza el precio total.

    const btnComprar = document.getElementById('cardOrder');//accedo al btn.

    btnComprar.children[4].addEventListener('click', async() =>{
        console.log('click al boton comprar');
        const delivery = {}
        
        getAllProductCart()
        .then(response =>{

        })
        const compra = {
            productos:array,
            total:totalPrice
        }
        // await fetch('/api/cart/order',{
        //     method:'POST',
        //     body:JSON.stringify(compra),
        //     headers:{'Content-type':'application/json'}
        // })
        // .then(result=>result.json())
        // .then(resultJson=>{
        //     if (resultJson.status === "success") {
        //         Swal.fire({
        //             icon: 'success',
        //             title: 'Compra finalizada',
        //             showConfirmButton: false,
        //             timer: 1500,
        //             timerProgressBar: true,
        //         })
        //         container.innerHTML = "";//limpio el DOM de los productos que habia 
        //     }
        // })
    })
})

// const cartsPorducts = getAllProductCart()
// console.log(cartsPorducts);

// if (cartsPorducts.payload.length === 0) {
//     let text = "";
//     text = `Carrito Vacio debes agregar aungun producto`
//     alertTitle.innerHTML = text;
// }
