import express from "express";
import { getTransaction,
        getTransactionById,
        createTransaction,
        updateTransaction,
        deleteTransaction
 } from "../controller/Transaction.js";

 import {verifyUser} from "../middleware/AuthUser.js"

const router = express.Router();


router.get('/checkout' ,verifyUser,getTransaction);
router.get('/checkout:id' ,verifyUser,getTransactionById);
router.post('/checkout' ,verifyUser,createTransaction);
router.patch('/checkout/:id' ,verifyUser,updateTransaction);
router.delete('/checkout/:id' ,verifyUser,deleteTransaction);

export default router;