
const register = document.getElementById('registerForm');

register.addEventListener('submit',(event)=>{
    event.preventDefault();
    const data = new FormData(register);
    const objet = {};//creo un objeto vacio.
    data.forEach((value,key)=>objet[key] = value)//recorro la data con un forEach y al objeto le agrego su clave y valor.
    fetch('/api/session/register',{
        method:'POST',
        body:JSON.stringify(objet),
        headers:{'Content-type':'application/json'}
    })//podemos cachear la promesa que nos devulven del back-end.
    .then(result=>result.json())//a la promesa que nos devuelve lo vamos a pasar a json
    .then(result=>{
        console.log(result)
    })//y mostrarlo en la consola.
    register.reset();
})