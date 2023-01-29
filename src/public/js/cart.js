'use strict'

const container = document.getElementById('container-cart');
const order = document.getElementById('container-order');
const titleAlert = document.getElementById('title-cart-page');

//hago una peticion a la ruta indicada en el fetch y me trae todos los productos que tenga el usuario agregado al carrito y los guardo en una funcion.
const getAllProductCart = async() =>{

    const get = await fetch('/api/cart');//pido los datos con un fetch.
    const result = await get.json();//parseo la data que me envian.
    //creo una condicion,que si el usuario no esta logeado no me muestre los productos que estan en el carrito.
    if (result.status === "error") return titleAlert.innerHTML = 'Debes iniciar session para ver tus productos agregados';
    if (result.payload.length === 0) return titleAlert.innerHTML = '¡tu carrito de compras esta vacio!';

    const data = result.payload;//desestructuro el resultado para obtener el arreglo de productos.
    const cliente = result.client;//obtengo el nombre del cliente.
    titleAlert.innerHTML = 'Bienvenido al carrito de Compra';
    let insertProducts = "";
    let insertOrder = "";
    let totalPrice = 0;

    data.forEach(element => {

        totalPrice += (element.price*element.quantity);//sumo la cantidad de por el precio de cada uno.
        insertProducts += `
        <div class="box-cart-children" id="${element.id}">
            <div>
                <img class="img-cart" src=${element.image} alt="">
            </div>
            <div class="detail-cart">
                <h3>${element.name}</h3>
                <h4>${element.mark}</h4>
                <p>cantidad: <b>${element.quantity}</b></p>
                <h4>Total:$ ${element.price*element.quantity}</h4>
                <button>Eliminar</button>
            </div>
        </div>
        `;
        container.innerHTML = insertProducts;//inserto los productos en el DOM para que se muestre en la vista.;

        //inserto una card donde esta la factura del precio total y el boton comprar.
        insertOrder = "";
        insertOrder=`
            <div id="cardOrder" class="card-order">
                <h2>Factura de Compra</h2>
                <h4>N° de pedido:</h4>
                <p>Cliente: ${cliente}</p>
                <h3>Total:$ ${totalPrice}</h3>
                <button>Comprar</button>
            </div>
            `
        order.innerHTML = insertOrder;//inserto el html en el DOM.
    });

    for (let i = 0; i < data.length; i++) {
        //creo un evento que vacie a la card seleccionada del carrito,cuando hagan click al boton eliminar.
        const card = document.getElementById(`${data[i].id}`)
        card.children[1].children[4].addEventListener('click', async()=>{
        
            await fetch(`/api/cart/delete/${data[i].id}`,{
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
                order.innerHTML = "";//limpio la tarjeta de factura cada vez que elimina un producto.
            })
            getAllProductCart();//llamo a la funcion para que me actualize el precio y los productos.
        })
    }

    const btnComprar = document.getElementById('cardOrder');//accedo al btn.
    //creo un evento que finalize las compras y elimine los prod. agregados al carrito.
    btnComprar.children[4].addEventListener('click', async() =>{
        let timerInterval
        Swal.fire({
            title: 'Procesando Pago...',
            html: 'Espere unos <b></b> segundos.',
            timer: 2000,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        })

        //armo el pedido para enviarlo al servidor.
        const pedido = {
            product:data,
            importe:totalPrice
        }

        await fetch('/api/cart/order',{
            method:'POST',
            body:JSON.stringify(pedido),
            headers:{'Content-type':'application/json'},
        })
        .then(result=>result.json())
        .then(resultJson=>{
            if (resultJson.status === "success") {
                Swal.fire({
                    icon: 'success',
                    title: 'Compra finalizada',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                })
                container.innerHTML = "";//limpio el DOM de los productos que habia
                order.innerHTML = "";
            }
        })
    })
}

getAllProductCart();