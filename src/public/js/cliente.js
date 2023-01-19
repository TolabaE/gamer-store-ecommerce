const socket = io({autoConnect:false});

const inputMessage = document.getElementById('inputChat');
const linetext = document.getElementById('text-message');
const perfil = document.getElementById('perfil-usuario');
const modalForm = document.getElementById('formDataModal');

let usuario = "";

modalForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const formdata = new FormData(e.target);
    const data = {
        id:formdata.get('email'),
        nombre:formdata.get('nombre'),
        apellido:formdata.get('apellido'),
        edad:formdata.get('edad'),
        alias: formdata.get('alias'),
        avatar:formdata.get('avatar'),
    }
    socket.connect();
    // modalForm.reset()//limpia los contenido que tenian los input.
    usuario = data;
})


const hora = new Date().toLocaleTimeString();
inputMessage.addEventListener('keyup',event=>{
    if (event.key === "Enter") {
        if (!usuario) {
            Swal.fire({
                // html:`` es para hacer un formulario en el swetalert
                icon: 'error',
                title: 'Registrate',
                text: 'No estas identificado con ningun usuario',
            })
        }
        const value = inputMessage.value.trim();
        if (value.length>0) {
            socket.emit('message',{author:usuario,text:value});//envio el mensaje al servidor
            inputMessage.value = "";
        }
    }
})


socket.on('arraychats',datos=>{
    let msg ="";
    datos.forEach(item => {
        msg += `<div class="p-chat">
                <p>${item.author.nombre}: ${item.text}</p>
            </div>`
    });
    linetext.innerHTML = msg;
    linetext.scrollTop= linetext.scrollHeight;//esta codigo permite que me valla tirando los mensajes para abajo sin tener que escrolear.
})

//<p class="time">${datos.mensajes}</p> este fragmento va en el chat me muestra la hora .

socket.on('newuser',user=>{
    Toastify({
        text:`${user} en linea`,
        duration: 3000,
        style: {
            background: "green",
        },
    }).showToast();
})


// Swal.fire({
//     title: 'Registrate',
//     input: 'text',
//     text:'ingrese su nombre de usuario',
//     inputValidator:(value)=>{
//         return !value && '¡necesitas ingresar con un nombre!'
//     },
//     allowOutsideClick:false,
//     allowEscapeKey:false,
// }).then(result=>{//capturo el valor que me envia el sweetalert.  
//     usuario = result.value;
//     socket.connect();
//     perfil.innerHTML = usuario;
//     socket.emit('registrado',usuario);
// });