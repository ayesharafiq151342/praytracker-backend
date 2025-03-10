import express from 'express'
import userAuth from '../middleware/userAuth.js';
import {getData} from '../controller/userController.js'
import {Status_check } from '../controller/userController.js';
const userRoutes = express.Router();
userRoutes.get('/data', userAuth, getData);
userRoutes.put("/update-status", Status_check)

export default userRoutes;