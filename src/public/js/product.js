"use strict";
const socket = io();
const containerdiv = document.getElementById('box-products');

//los datos son enviados del lado del servidor y aqui los hago un mapeo para mostrarle en el DOM.

socket.on('arrayProductos',productos=>{
    //cada vez que recorra el arreglo,limpie lo que habia y lo iguala a un string vacio.
    let insertDOM = "";
    productos.forEach((item,index) => {
        insertDOM += `
        <div class="container-card" id="${index}">
            <div class="container-img">
                <img src=${item.image} class="box-img" alt="imagen del productos">
            </div>
            <div class="container-detail">
                <h3>${item.nombre}</h3>
                <p>marca: ${item.marca}</p>
                <p>stock: ${item.stock} unidades</p>
                <div class="count-cart">
                    <button>-</button>
                    <b>0</b>
                    <button>+</button>
                </div>
                <h4>$${item.precio}</h4>
            </div>
            <span class="container-card_button"><img src="https://img.icons8.com/material-outlined/30/000000/shopping-cart--v1.png"/></span>
        </div>`
    });
    containerdiv.innerHTML = insertDOM;


    for (let index = 0; index < productos.length; index++) {
        // const product = array[index];
        let contador = 0;
        const cards = document.getElementById(`${index}`);//con el indice de la card puedo acceder a sus etiquetas hijas.
        const number = cards.children[1].children[3].children[1];//accedo a la etiqueta para modificar su valor insertanto texto html.

        //creo un evento que sume el productos al dar click en el boton agregar.
        cards.children[1].children[3].children[2].addEventListener('click',()=>{
            const element = productos[index];//accedo al indice del producto;
            if (element.stock > contador) { 
                number.innerText = `${++contador}`;//si el contador es menor al stock,aumenta la cantidad.
            }
        });

        //creo un evento que resta la cantidad de productos al dar click en el boton restar.
        cards.children[1].children[3].children[0].addEventListener('click',()=>{
            const valor = number.innerText;//puedo obtener el valor de la etiqueta que estoy llamando.
            if (valor > 0) {
                number.innerText = `${--contador}`;//si el valor es mayor a 0,que reste el contador.
            }
        });

        //aqui accedo al boton de la card,y realizo un evento que agrega productos al carrito
        cards.children[2].addEventListener('click', async()=>{
            //si el contador es distinto de 0,me permita enviar el dato al servidor.
            if (contador !== 0) {
                const item = productos[index];//accedo al indice de la card en el arreglo
                const pedido = {
                    prod_id:item._id,
                    cantidad:contador
                }
                number.innerText = 0;//seteo el valor de cantidad a 0 una vez agregado el producto al carrito.
                //realizo un envio con el fetch a la ruta donde voy a recibir los productos.
                await fetch('/api/cart/pedido',{
                    method:'POST',
                    body:JSON.stringify(pedido),
                    headers:{'Content-type':'application/json'}
                })//podemos cachear la promesa que nos devulven del back-end.
                .then(response => response.json())
                .then(result =>{
                    if (result.status === "error") {
                        Toastify({
                            text: `${result.error}`,
                            duration: 2000,
                            gravity: "top", // `top` or `bottom`
                            position: "right", // `left`, `center` or `right`
                            stopOnFocus: true, // Prevents dismissing of toast on hover
                            style: {
                                background: "linear-gradient(90deg, rgba(250,49,49,1) 0%, rgba(238,78,36,1) 47%, rgba(238,122,36,1) 90%)"
                            },
                        }).showToast();
                    } else {
                        Toastify({
                            text:"Producto agregado al carrito",
                            duration: 2000,
                            gravity: "top", // `top` or `bottom`
                            position: "right", // `left`, `center` or `right`
                            stopOnFocus: true, // Prevents dismissing of toast on hover
                            style: {
                                background: "linear-gradient(to right, #00b09b, #96c93d)",
                            },
                        }).showToast();
                    }
                });
            };
        });
    };
});