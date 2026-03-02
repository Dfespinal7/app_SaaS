import { Router } from "express";
import { getAllusers } from "../controllers/user.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
export const userRouter=Router()

userRouter.get('/users', getAllusers)
