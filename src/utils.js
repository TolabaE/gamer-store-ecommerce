import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';


//este codigo de ayuda a crear rutas absolutas.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = async(password)=>{
    const  salts = await bcrypt.genSalt(10)//es el numero de rondas que debe hacer para generar una cadena de password.
    return bcrypt.hash(password,salts)//le pasamos el password y el numero de saltos de recontruccion y construccion de codigo.
}

//este funcion me permite comparar el pasword que recibe con el encriptado y me retorna true o false. 
export const isValidPassword = async(user,password)=> await bcrypt.compare(password,user.password)

export default __dirname;