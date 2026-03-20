import {Router} from 'express'
import { login, logout, profileControllerUser, register } from './auth.controller.js'
import { authMiddleware } from '../../middlewares/auth.middlewares.js'
export const authRoutes=Router()

authRoutes.post('/auth/register',register)
authRoutes.post('/auth/login',login)
authRoutes.post('/auth/logout',authMiddleware,logout)
authRoutes.get('/auth/me',authMiddleware,profileControllerUser)