import {Router} from 'express'
import { authMiddleware } from '../../middlewares/auth.middlewares.js'
import { roleMiddleware } from '../../middlewares/role.middleware.js'
import { createAppointmentController } from './appointments.controller.js'

export const appointmentRoutes=Router()

appointmentRoutes.post('/appointments/slots',authMiddleware,roleMiddleware(["professional","admin"]),createAppointmentController)