import express from "express";
import {
    getProducts,
    getProductUser,
    getProductsById,
    saveProducts,
    updateProducts,
    deleteProducts
} from "../controller/Products.js"
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/products',getProducts);
router.get('/productsUser',verifyUser,getProductUser);
router.get('/products/:id',verifyUser,getProductsById);
router.post('/products',verifyUser,saveProducts);
router.patch('/products/:id' ,verifyUser,updateProducts);
router.delete('/products/:id' ,verifyUser,deleteProducts);

export default router;