'use strict'
const register = document.getElementById('registerForm');
const alert = document.getElementById('textAlert');

register.addEventListener('submit',(event)=>{
    event.preventDefault();
    const data = new FormData(register);//accedo a los datos del formulario.
    fetch('/api/session/register',{
        method:'POST',
        body:data,
    })//podemos cachear la promesa que nos devulven del back-end.
    .then(result=>result.json())//a la promesa que nos devuelve lo vamos a pasar a json
    .then(result=>{
        if (result.status == "success") {
            alert.innerHTML = `<h3 style:"color:green">El usuario ${result.payload} fue registrado</h3>`,
            register.reset();
        }
        else if (result.status === "error"){
            alert.innerHTML = `<h3 style="color:red">A ocurrido un error al intentar registrarte</h3>`
        }
    })
})