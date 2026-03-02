import {Router} from 'express'
import { login, register } from './auth.controller.js'
export const authRoutes=Router()

authRoutes.post('/auth/register',register)
authRoutes.post('/auth/login',login)