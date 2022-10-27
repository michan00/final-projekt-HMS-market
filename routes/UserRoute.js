import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../controller/Users.js"
import {verifyUser, adminOnly} from "../middleware/AuthUser.js"

const router = express.Router();

router.get('/users' ,adminOnly,getUsers);
router.get('/users/:id',verifyUser, getUserById);
router.post('/users/',createUser);
router.patch('/users/:id',verifyUser,updateUser);
router.delete('/users/:id',verifyUser,deleteUser);

export default router;