const socket = io({autoConnect:false});

const inputMessage = document.getElementById('inputChat');
const linetext = document.getElementById('text-message');
const perfil = document.getElementById('perfil-usuario');

let usuario = "";

Swal.fire({
    title:"Registrarse",
    input:"text",
    text:'ingrese un nombre de usuario',
    inputValidator:(value)=>{
        return !value && '¡necesitas ingresar con un nombre!'
    },
    //te permite bloquear el click a fuera del alerta,asi no se cierra la ventanas.
    allowOutsideClick:false,
    allowEscapeKey:false,//no te permite salir cuando hagas click en la tecla esc.
})
.then(result=>{//capturo el nombre de usuario que me envian por el sweetalert.
    usuario = result.value;
    socket.connect();
    socket.emit('registrado',usuario);//envio los datos del cliente al servidor.
    perfil.innerHTML = usuario;
})


const hora = new Date().toLocaleTimeString();
inputMessage.addEventListener('keyup',event=>{
    if (event.key === "Enter") {

        const value = inputMessage.value.trim();
        if (value.length > 0) {
            socket.emit('message',{author:usuario,text:value});//envio el mensaje al servidor
            inputMessage.value = "";
        }else{

        }
        
    }
})


socket.on('arraychats',datos=>{
    let msg ="";
    datos.forEach(item => {
        msg += `<div class="p-chat">
                <p>${item.author}: ${item.text}</p>
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