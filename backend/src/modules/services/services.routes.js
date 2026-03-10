import {Router} from 'express'
import { authMiddleware } from '../../middlewares/auth.middlewares.js'
import { roleMiddleware } from '../../middlewares/role.middleware.js'
import { createServicesController, getMyServicesController, serviceForProfessionalController, servicesForUsersController } from './services.controller.js'

export const servicesRoutes=Router()

servicesRoutes.post('/services',authMiddleware,roleMiddleware(["professional"]),createServicesController)
servicesRoutes.get('/services/me',authMiddleware,roleMiddleware(["professional"]),getMyServicesController)
servicesRoutes.get('/services/:id',authMiddleware,servicesForUsersController)
servicesRoutes.get('/professionals/:id/services',authMiddleware,serviceForProfessionalController)