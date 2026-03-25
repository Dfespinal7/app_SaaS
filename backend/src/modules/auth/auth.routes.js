import {Router} from 'express'
import { login, logout, profileControllerUser, register } from './auth.controller.js'
import { authMiddleware } from '../../middlewares/auth.middlewares.js'
export const authRoutes=Router()

authRoutes.post('/auth/register',register)//resgistrar usuario, solo usuario, alli se le asigna role y en otro endpoint se crea el profesional
authRoutes.post('/auth/login',login)//login de usuario y profesional
authRoutes.post('/auth/logout',authMiddleware,logout)//cerrar sesion de usuario
authRoutes.get('/auth/me',authMiddleware,profileControllerUser)//perfil de usuario