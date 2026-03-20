import { pool } from "../../config/db.js"
import { bookAppointmentService, cancelASlotService, completeAppointmentService, createAppointmentsService, getAppointmentsForServiceService, getMyAppointmentsService, profesionalGetHisAppointmentsService } from "./appointments.services.js"

export const createAppointmentController = async (req, res) => {
    try {
        const result = await createAppointmentsService(req.body, req.user.id)

        res.json(result)
    } catch (e) {
        console.log('ERROR AL CREAR AGENDA', e)
        res.status(500).json({ message: 'error en el server' })
    }
}
export const getAppointmentsForServiceController = async (req, res) => {

    try {
        const result = await getAppointmentsForServiceService(req.params.id)
        res.json({ appointments: result })
    } catch (e) {
        console.log('ERROR AL OBTENER AGENDAS POR SERVICIO', e)
        if (e.message === "SERVICE_NOT_FOUND") {
            return res.status(404).json({ message: 'Servicio no encontrado' })
        }
        if (e.message === "PARAM_NOT_VALID") {
            return res.status(400).json({ message: 'el parametro ingresado no es valido' })
        }
        res.status(500).json({ message: 'Error en el server' })
    }
}

export const bookAppointmentController = async (req, res) => {
    try {
        const result = await bookAppointmentService(req.params.id, req.user.id)
        res.json({ slot_assigned: result })
    } catch (e) {
        console.log('ERROR AL ASIGNAR CITA', e)
        if (e.message === 'APPOINTMENT_NOT_FOUND') {
            return res.status(404).json({ message: 'la cita que intenta asignar no existe' })
        }
        if (e.message === 'NOT_AVAILABLE') {
            return res.status(409).json({ message: 'la cita no se encuentra disponible' })
        }
        if (e.message === 'DATE_IN_PAST') {
            return res.status(400).json({ message: 'la fecha de la cita ya paso, no es posible asignarla' })
        }
        return res.status(500).json('Erro en el server')
    }
}
export const getMyAppointmentsController = async (req, res) => {
    try {
        const result = await getMyAppointmentsService(req.user.id,req.query.status)
        res.json(result)
    } catch (e) {
        console.log('ERROR AL OBTENER CITAS', e)
        if (e.message === 'WITHOUT_APPOINTMENTS') {
            return res.status(404).json({ message: 'No tiene citas asignadas hasta el momento' })
        }
        return res.status(500).json({ message: 'Error en el server' })
    }
}

export const cancelASlotController = async (req, res) => {
    try {
        const result = await cancelASlotService(req.params.id, req.user.id)
        res.json(result)
    } catch (e) {
        console.log('ERROR AL CANCELAR CITAS', e)
        if (e.message === 'SLOT_NOT_FOUND') {
            return res.status(404).json({ message: 'La cita que intenta cancelar no existe' })
        }
        if (e.message === 'CLIENT_DIFERENT') {
            return res.status(409).json({ message: 'La cita que intenta cancelar no esta a nombre del usuario autenticado' })
        }
        if (e.message === 'ALREADY_CANCELED') {
            return res.status(409).json({ message: 'La cita que intenta cancelar no esta confirmada aun' })
        }
        if (e.message === 'APPOINTMENT_ALREADY_FINISHED') {
            return res.status(409).json({ message: 'La fecha de la cita que intenta cancelar ya pasó' })
        }

        return res.status(500).json({ message: 'Error en el server' })
    }
}
export const profesionalGetHisAppointments = async (req, res) => {
    try {
        const result = await profesionalGetHisAppointmentsService(req.user.id)
        res.json(result)
    } catch (e) {
        console.log('ERROR AL OBTENER CITAS POR PROFESIONAL', e)
        if (e.message === 'PROFESSIONAL_NOT_FOUND') {
            return res.status(404).json({ message: 'profesional no encontrado o innactivo' })
        }
        return res.status(500).json({ message: 'ERROR EN EL SERVER' })
    }
}
export const completeAppointmentController = async (req, res) => {
    try {
        const result = await completeAppointmentService(req.params.id, req.user.id)
        res.json(result)
    } catch (e) {
        console.log('ERROR AL COMPLETAR CITA POR PROF', e)
        if (e.message === 'APPOINTMENT_NOT_FOUND') {
            return res.status(404).json({ message: 'la cita no existe en la base de datos' })
        }
        if (e.message === 'PROFESSIONAL_NOT_FOUND') {
            return res.status(404).json({ message: 'profesional no encontrado o innactivo' })
        }
        if (e.message === 'APPOINTMENT_IS_NOT_YOUR') {
            return res.status(409).json({ message: 'la cita no pertenece a este profesional' })
        }
        if (e.message === 'APPOINTMENT_IS_NOT_CONFIRMED') {
            return res.status(409).json({ message: 'la cita no ha sido confirmada' })
        }
        if (e.message === 'APPOINTMENT_HAVE_NOT_BEEN') {
            return res.status(400).json({ message: 'la cita aun no ha pasado' })
        }
       return res.status(500).json({ message: 'error en el server' })
    }
}