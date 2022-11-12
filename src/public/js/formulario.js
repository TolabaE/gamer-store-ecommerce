"use strict";
const socket = io();
const containerdiv = document.getElementById('box-products');

socket.on('arrayProductos',productos=>{
    let arreglo = ""
    productos.forEach(item => {
        arreglo += `<div class="container-card" ${item.id} >
            <div class="container-img">
                <img src=${item.image} class="box-img" alt="imagen del productos">
            </div>
            <div class="container-detail">
                <h3>${item.nombre}</h3>
                <p>marca: ${item.marca}</p>
                <h4>$${item.precio}</h4>
            </div>
        </div>`
    });
    containerdiv.innerHTML = arreglo;
})