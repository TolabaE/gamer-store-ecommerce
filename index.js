class Usuario {
    constructor(nombre,apellido){
        this.nombre= nombre;
        this.apellido=apellido;
        this.libros=[];
        this.mascotas=[];
    }
    getFullName=()=>{
        console.log(`su nombre es: ${this.nombre} ${this.apellido}`);
    }
    addMascota=(animal)=>{
        this.mascotas.push(animal);
    }
    countMascotas=()=>{
        return this.mascotas.length;
    }
    addBook=(namebook,escritor)=>{
        let objeto = {nombre:namebook,autor:escritor}
        this.libros.push(objeto);
    }
    getBookName=()=>{
        console.log(`de la persona ${this.nombre} los nombres de los libros son:`);
        this.libros.map(elemento=>{
            console.log(` ${elemento.nombre}`);
        })
    }
}

const persona1 = new Usuario ("Juan","Perez");
const persona2 = new Usuario ("Carlos","Tevez");

persona1.getFullName();
persona2.getFullName();

persona1.addMascota("perro");
persona1.addMascota("gato");
persona2.addMascota("gallina");
persona2.addMascota("conejo");
persona2.addMascota("gato");

const contadoranimal1 = persona1.countMascotas();
const contadoranimal2 = persona2.countMascotas();

console.log(`la persona ${persona1.nombre} tiene ${contadoranimal1} mascotas`);
console.log(`la persona ${persona2.nombre} tiene ${contadoranimal2} mascotas`);

persona1.addBook("cien años de soledad","Garcia Marquez");
persona1.addBook("las arenas del tiempo","sidney sheldon");
persona1.addBook("emociones toxicas","Bernardo stamateas");
persona2.addBook("El origen de las especies","Charls Darwins");

persona1.getBookName();
persona2.getBookName();
