process.on('message',(objeto)=>{
    const {cantidad} = objeto;
    const randomNumber=(random = 100000000)=>{
        let obj ={};
        for (let i = 0; i < random; i++) {
            //este metodo de crea numeros aleatorios y te los guarda en una constante.
            const randomNumber = Math.floor(Math.random()*1000);
            //me dice la cantidad de veces que salio ese numero.
            if (obj[randomNumber]) {
                obj[randomNumber]++
            } else {
                obj[randomNumber]=1;
            }
        }
        return obj;
    }
    const result = randomNumber(cantidad);
    process.send(result)//envio el resultado de los numeros random generados al padre.
})