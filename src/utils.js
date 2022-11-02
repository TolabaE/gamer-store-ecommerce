import {fileURLToPath} from 'url';
import { dirname } from 'path';
//este codigo de ayuda a crear rutas absolutas.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;