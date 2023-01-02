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
        console.log(result);
        if (result.status == "success") {
            loginForm.reset();
            Swal.fire({
                icon: 'success',
                title: 'Bienvenido',
                text: `El usuario ${result.name} a iniciado session`,
                timer:3000,
                showConfirmButton: false,
                timerProgressBar: true,
            }).then(()=>{
                window.location = "/form"
            })
        }else if (result.status === "error"){
            Toastify({
                text: "el usuario o contraseña es incorrecto",
                duration: 3000
            }).showToast();
        }
    })
})

// else if(result.status == null){
//     Toastify({
//         text: "Datos incompletos",
//         duration: 3000
//     }).showToast();
// }else if(result.status == false){
//     Toastify({
//         text: "el email ingresado es incorrecto",
//         duration: 3000
//     }).showToast();
// }
