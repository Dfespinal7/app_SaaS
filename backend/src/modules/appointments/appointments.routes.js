import {Router} from 'express'
import { authMiddleware } from '../../middlewares/auth.middlewares.js'
import { roleMiddleware } from '../../middlewares/role.middleware.js'
import { createAppointmentController, getAppointmentsForServiceController } from './appointments.controller.js'


export const appointmentRoutes=Router()

appointmentRoutes.post('/appointments/slots',authMiddleware,roleMiddleware(["professional","admin"]),createAppointmentController)
appointmentRoutes.get('/services/:id/available-slots',authMiddleware,roleMiddleware(["client","professional"]),getAppointmentsForServiceController)