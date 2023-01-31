// import mongoose from "mongoose";
// import __dirname from "../utils.js";
// import ContainerMongoProducts from "./contMongoProducts.js";
// import ContainerMongoCart from "./contMongoCart.js";
// import productsModel from "../models/products.js";
// import cartModel from "../models/cart.js";
// import dotenvConfig from "../config/dotenv.config.js";


// //aqui escribimos la persistencia que queremos usar ya se Filesistem o mongoose;
// let persistencia = 'mongoose';

// let ManagerProduct
// let ManagerCart

// //el switch me permite cambiar mi variable de acuerdo al nombre de persistencia. y los metodos que tendra cada uno.
// switch (persistencia) {
//     case 'mongoose':

//         const connection = mongoose.connect(`mongodb+srv://${dotenvConfig.mongo.USER}:${dotenvConfig.mongo.PWD}@codercluster0.nvobhct.mongodb.net/${dotenvConfig.mongo.DB}?retryWrites=true&w=majority`,error=>{
//             if(error) console.log(error);
//             else console.log('base mongoose conectada');
//         });

//         ManagerCart = new ContainerMongoCart(cartModel);
//         ManagerProduct = new ContainerMongoProducts(productsModel);
//         break;
// }


// const ContainerDAOs = {ManagerProduct,ManagerCart};

// export default ContainerDAOs;