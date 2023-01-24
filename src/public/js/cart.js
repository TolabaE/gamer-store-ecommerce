'use strict'
const container = document.getElementById('container-cart');
const order = document.getElementById('container-order');


fetch('/api/cart')
.then(result=>result.json())
.then(data=>{
    let insertProducts = "";
    let insertOrder = "";
    let totalPrice = 0;

    data.forEach(element => {
        totalPrice += element.precio*element.cantidad;
        insertProducts += `
        <div class="box-cart-children">
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
        container.innerHTML = insertProducts;
    });

    insertOrder+=`
    <div id="card-order" class="card-order">
        <h4>N° de pedido:</h4>
        <h3>Total:$ ${totalPrice}</h3>
        <button>Comprar</button>
    </div>
    `
    order.innerHTML = insertOrder;//inserto el html en el DOM.
    const btnComprar = document.getElementById('card-order');//accedo al btn.
    btnComprar.children[2].addEventListener('click',()=>{
        const compra = {
            productos:data,
            total:totalPrice
        }
        fetch('/api/cart/order',{
            method:'POST',
            body:JSON.stringify(compra),
            headers:{'Content-type':'application/json'}
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
            }
        })
    })
})
