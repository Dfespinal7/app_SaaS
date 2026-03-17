import {Router} from 'express'
import { authMiddleware } from '../../middlewares/auth.middlewares.js'
import { roleMiddleware } from '../../middlewares/role.middleware.js'
import { bookAppointmentController, cancelASlotController, createAppointmentController, getAppointmentsForServiceController, getMyAppointmentsController } from './appointments.controller.js'


export const appointmentRoutes=Router()

appointmentRoutes.post('/appointments/slots',authMiddleware,roleMiddleware(["professional","admin"]),createAppointmentController)//crear agenda por profesional
appointmentRoutes.get('/services/:id/available-slots',authMiddleware,roleMiddleware(["professional","client"]),getAppointmentsForServiceController)//ver agenda por cliente
appointmentRoutes.post('/appointments/:id/book',authMiddleware,roleMiddleware(["client"]),bookAppointmentController )//asignar una cita, por cliente
appointmentRoutes.get('/appointments/me',authMiddleware,roleMiddleware(["client"]),getMyAppointmentsController)//ver historial de citas por cliente
appointmentRoutes.patch('/appointments/:id/cancel',authMiddleware,roleMiddleware(["client"]),cancelASlotController)