import Dao from "../dao/dao.js";
import UserRepository from "./repository/userRepository.js";
import ProductRepository from "./repository/productRepository.js";
import CartRepository from "./repository/cartRepository.js";


const dao = new Dao();

export const userService = new UserRepository(dao);
export const productService = new ProductRepository(dao);
export const cartService = new CartRepository(dao);