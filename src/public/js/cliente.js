const socket = io({autoConnect:false});

const inputMessage = document.getElementById('inputChat');
const linetext = document.getElementById('text-message');
const perfil = document.getElementById('perfil-usuario');
let usuario 

Swal.fire({
    title: 'Registrate',
    input: 'text',
    text:'ingrese su nombre de usuario',
    inputValidator:(value)=>{
        return !value && '¡necesitas ingresar con un nombre!'
    },
    allowOutsideClick:false,
    allowEscapeKey:false,
}).then(result=>{//capturo el valor que me envia el sweetalert.  
    usuario = result.value;
    socket.connect();
    perfil.innerHTML = usuario;
    socket.emit('registrado',usuario);
});

const hora = new Date().toLocaleTimeString();
inputMessage.addEventListener('keyup',event=>{
    if (event.key === "Enter") {
        const value = inputMessage.value.trim();
        if (value.length>0) {
            socket.emit('message',{usuario,mensaje:value,time:hora});//envio el mensaje al servidor
            inputMessage.value = "";
        }
    }
})


socket.on('arraychats',datos=>{
    let msg ="";
    datos.forEach(receptor => {
        msg += `<div class="p-chat">
                    <p>${receptor.usuario}:${receptor.mensaje}</p>
                    <p class="time">${receptor.time}</p>
                </div>`
    });
    linetext.innerHTML = msg;
    linetext.scrollTop= linetext.scrollHeight;//esta codigo permite que me valla tirando los mensajes para abajo sin tener que escrolear.
})

socket.on('newuser',user=>{
    Toastify({
        text:`${user} en linea`,
        duration: 3000,
        style: {
            background: "green",
        },
    }).showToast();
})