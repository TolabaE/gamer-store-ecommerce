'use strict'
const loginForm = document.getElementById('loginForm');
const linkHome = document.getElementById('link-home');


loginForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    const data = new FormData(loginForm);
    const obj = {};
    data.forEach((value,key)=>obj[key] = value);
    fetch('/api/session/login',{
        method:'POST',
        body: JSON.stringify(obj),
        headers:{'Content-type':'application/json'}
    })
    .then(result=>result.json())
    .then(result=> {
        if (result.status == "success") {
            Swal.fire({
                icon: 'success',
                title: 'Bienvenido',
                text: `El usuario ${result.name} a iniciado session`,
            })
            loginForm.reset();
            linkHome.innerHTML = `<a href="/form">Ir al Sitio Web</a>`
        }else if(result.status == null){
            Toastify({
                text: "Datos incompletos",
                duration: 3000
            }).showToast();
        }else if(result.status == false){
            Toastify({
                text: "el usuario o contraseña son incorrectos",
                duration: 3000
            }).showToast();
        }
    })
})
