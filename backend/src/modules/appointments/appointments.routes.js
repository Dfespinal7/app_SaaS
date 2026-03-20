import {Router} from 'express'
import { authMiddleware } from '../../middlewares/auth.middlewares.js'
import { roleMiddleware } from '../../middlewares/role.middleware.js'
import { bookAppointmentController, cancelASlotController, completeAppointmentController, createAppointmentController, getAppointmentsForServiceController, getMyAppointmentsController, profesionalGetHisAppointments } from './appointments.controller.js'


export const appointmentRoutes=Router()

appointmentRoutes.post('/appointments/slots',authMiddleware,roleMiddleware(["professional","admin"]),createAppointmentController)//crear agenda por profesional
appointmentRoutes.get('/services/:id/available-slots',authMiddleware,roleMiddleware(["professional","client"]),getAppointmentsForServiceController)//ver agenda por cliente
appointmentRoutes.post('/appointments/:id/book',authMiddleware,roleMiddleware(["client"]),bookAppointmentController )//asignar una cita, por cliente
appointmentRoutes.get('/appointments/me',authMiddleware,roleMiddleware(["client"]),getMyAppointmentsController)//ver historial de citas por cliente
appointmentRoutes.patch('/appointments/:id/cancel',authMiddleware,roleMiddleware(["client"]),cancelASlotController)//permite al usuario cancelar citas a su nombre
appointmentRoutes.get('/professionals/me/appointments',authMiddleware,roleMiddleware(["professional"]),profesionalGetHisAppointments)//profesional ve todas las citas a su nombre
appointmentRoutes.patch('/appointments/:id/complete',authMiddleware,roleMiddleware(["professional"]),completeAppointmentController)// confirmar cita por profesional