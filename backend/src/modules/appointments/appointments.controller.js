import { pool } from "../../config/db.js"
import { createAppointmentsService, getAppointmentsForServiceService } from "./appointments.services.js"

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
        res.json({services:result})
    } catch (e) {
        console.log('ERROR AL OBTENER AGENDAS POR SERVICIO',e)
        if(e.message==="SERVICE_NOT_FOUND"){
            return res.status(404).json({message:'Servicio no encontrado'})
        }
        if(e.message==="PARAM_NOT_VALID"){
            return res.status(400).json({message:'el parametro ingresado no es valido'})
        }
        res.status(500).json({message:'Error en el server'})
    }
}