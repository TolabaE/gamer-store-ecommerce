import winston from 'winston';

//yo le doy la prioridad a mis distintos niveles de winston.
const customLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
}

//aqui estoy creando los niveles de winston,y los archivos donde se van a guardar los distintos console.log
const logger = winston.createLogger({
    levels:customLevels,
    transports:[
        new winston.transports.Console({ level:'info' }),//apartir del nivel indicado me muestra los logs por consola.
        new winston.transports.File({ filename: './src/logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './src/logs/warn.log', level: 'warn' }),
        new winston.transports.File({filename: './src/logs/combined.log',level:'info'})
    ]
});

//al logger lo guardo en una funcion para poder usarlo como middlewear y este disponible en todos lados,sin tener que importar la funcion.
const addLoggers = (req,res,next) =>{
    req.logger = logger;
    next();
};

export default addLoggers;
