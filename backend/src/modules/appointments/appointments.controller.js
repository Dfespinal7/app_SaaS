import { pool } from "../../config/db.js"
import { bookAppointmentService, createAppointmentsService, getAppointmentsForServiceService } from "./appointments.services.js"

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
        console.log('ERROR AL ASIGNAR CITA',e)
        if (e.message==='APPOINTMENT_NOT_FOUND'){
            return res.status(404).json({message:'la cita que intenta asignar no existe'})
        }
        if (e.message==='NOT_AVAILABLE'){
            return res.status(409).json({message:'la cita no se encuentra disponible'})
        }
        if (e.message==='DATE_IN_PAST'){
            return res.status(400).json({message:'la fecha de la cita ya paso, no es posible asignarla'})
        }
        return res.status(500).json('Erro en el server')
    }
}