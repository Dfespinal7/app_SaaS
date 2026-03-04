import {Router} from 'express'
import { authMiddleware } from '../../middlewares/auth.middlewares.js'
import { roleMiddleware } from '../../middlewares/role.middleware.js'
import { createServicesController } from './services.controller.js'

export const servicesRoutes=Router()

servicesRoutes.post('/services',authMiddleware,roleMiddleware(["professional"]),createServicesController)