import { pool } from "../../config/db.js"

export const createAppointmentsService = async (body, id_user) => {
    const { service_id, start_datetime, end_datetime, status, notes } = body
    const searchService = await pool.query('SELECT id,professional_id,active FROM services where id=$1', [service_id])//validamos que el servicio exista

    const searchProfessional = await pool.query('SELECT id,active FROM professionals where user_id=$1', [id_user])//buscamos el profesional desde el req.user,asegurandonos que el usuario que intenta crear la agenda si sea profesional, aunque ya eso lo valida el middleware


    if (searchProfessional.rows.length === 0 || !searchProfessional.rows[0]?.active) {//si el profesional no esta registrado o esta innactivo, enviamos error
        throw new Error('PROFESSIONAL_NOT_FOUND')
    }
    const professional_id = searchProfessional.rows[0]?.id//si el profesional es el que esta logueado asignamos la constante

    if (searchService.rows.length === 0 || !searchService.rows[0]?.active) {//validamos que el servicio este activo
        throw new Error('SERVICE_NOT FOUND')
    }

    if (searchService.rows[0].professional_id !== professional_id) {//validamos que el servicio seleccionado si corresponda al profesional que lo creó
        throw new Error('INVALID_PROFESSIONAL_FOR_SERVICE')
    }
    if (!start_datetime || !end_datetime) {//validamos que el body tenga estos campos
        throw new Error('MISSING_DATE')
    }
    const start = new Date(start_datetime) //transformamos datos aunque la idea esque desde el body ya vengan asi
    const end = new Date(end_datetime)

    if (isNaN(start) || isNaN(end)) {//validamos el formato de las fechas
        throw new Error("INVALID_DATE_FORMAT")
    }
    if (start >= end) {//validamos que la hora de inicio sea antes que la hora final 
        throw new Error("INVALID_TIME_RANGE")
    }
    if (start < new Date()) {//validamos que no se ingresen fechas en pasado
        throw new Error("SLOT_IN_PAST")
    }
    const validSlot = await pool.query(`SELECT id FROM appointments where professional_id=$1 AND status<>'canceled' AND (start_datetime<$2 AND end_datetime >$3)`, [professional_id, end, start])
    if (validSlot.rows.length > 0) {
        throw new Error('SLOT_CONFLICT')
    }

    const response = await pool.query('INSERT INTO appointments(service_id,professional_id,start_datetime,end_datetime,status,notes)VALUES($1,$2,$3,$4,$5,$6) RETURNING service_id,professional_id,start_datetime,end_datetime,status,notes', [service_id, professional_id, start_datetime, end_datetime, status, notes])
    return response.rows
}
export const getAppointmentsForServiceService = async (id) => {
    if (!id) {
        throw new Error('PARAM_NOT_VALID')
    }
    const validService = await pool.query('SELECT id,active FROM services where id=$1', [id])
    if (validService.rows.length === 0 || !validService.rows[0].active) {
        throw new Error('SERVICE_NOT_FOUND')
    }
    const fecha_actual = new Date

    const query = await pool.query(`SELECT id,service_id,professional_id,client_id,start_datetime,end_datetime,status,notes FROM appointments WHERE service_id=$1 AND start_datetime>$2 AND status = 'available' ORDER BY start_datetime ASC`, [id, fecha_actual])
    return query.rows
}

export const bookAppointmentService = async (id_appointment, id_user) => { //funcion para reservar cita
    if (!Number.isInteger(Number(id_appointment)) || Number(id_appointment) <= 0) {//validamos que el parammetro ingresado si es un numero
        throw new Error('INVALID_APPOINTMENT_ID')
    }
    const fecha_actual = new Date//constante que siempre guarda hora y fecha actual
    const validAppointment = await pool.query('SELECT id,status,start_datetime FROM appointments where id=$1 ', [id_appointment])//validamos que la cita exista
    if (validAppointment.rows.length === 0) {
        throw new Error('APPOINTMENT_NOT_FOUND')
    }
    if (fecha_actual > validAppointment.rows[0].start_datetime) {//validamos que la cita ya no haya pasado(este en futuro)
        throw new Error('DATE_IN_PAST')
    }
    if (validAppointment.rows[0]?.status.toLowerCase() !== 'available') {//validamos que la seleccionada se encuentre disponible
        throw new Error('NOT_AVAILABLE')
    }


    const updateSlot = await pool.query(`UPDATE appointments SET client_id=$1,status='confirmed' where id=$2 AND status='available' RETURNING id,service_id,professional_id,client_id,start_datetime,end_datetime,status`, [id_user, id_appointment])//asignamos usuario autenticado y cambiamos estdo
    if (updateSlot.rows.length === 0) {//retorno en caso de que dos usuarios hayan seleccionado la cita al mismo tiempo
        throw new Error('NOT_AVAILABLE')
    }
    return updateSlot.rows[0]//retornamos la cita
}

export const getMyAppointmentsService = async (client_id) => {
    const getMySlots = await pool.query('select a.id,s.name AS service_name,u.name AS professional_name,a.start_datetime,a.end_datetime,a.status from appointments a INNER JOIN services s ON a.service_id=s.id INNER JOIN professionals p ON a.professional_id=p.id INNER JOIN users u ON p.user_id=u.id where a.client_id=$1 ORDER BY start_datetime ASC', [client_id])
    if (getMySlots.rows.length === 0) {
        throw new Error('WITHOUT_APPOINTMENTS')
    }
    return getMySlots.rows
}
export const cancelASlotService = async (id_cita, id_user) => {
    const validSlot = await pool.query('SELECT id,client_id,status,start_datetime FROM appointments where id=$1', [id_cita])
    if (validSlot.rows.length === 0) {
        throw new Error('SLOT_NOT_FOUND')
    }
    const reserva = validSlot.rows[0]
    if (reserva.client_id !== id_user) {
        throw new Error('CLIENT_DIFERENT')
    }
    if (reserva.status !== 'confirmed') {
        throw new Error('ALREADY_CANCELED')
    }
    const fecha_actual = new Date()
    if (fecha_actual > reserva.start_datetime) {
        throw new Error('APPOINTMENT_ALREADY_FINISHED')
    }
    const updateAppointment = await pool.query(`UPDATE appointments SET client_id=NULL,status='available' where id=$1 AND client_id=$2 RETURNING *`, [id_cita, id_user])

    return { message: 'cita Cancelada correctamente', cita: updateAppointment.rows }
}
export const profesionalGetHisAppointmentsService = async (id_user) => {
    const profesionaIs = await pool.query('SELECT id,active FROM professionals where user_id=$1', [id_user])
    if (profesionaIs.rows.length === 0 || !profesionaIs.rows[0]?.active) {
        throw new Error('PROFESSIONAL_NOT_FOUND')
    }
    const profesional_id = profesionaIs.rows[0].id
    const professionalsAppointments = await pool.query('SELECT a.id, s.name AS service_name,c.name AS client_name, a.start_datetime,a.end_datetime,a.status,a.professional_id from appointments a INNER JOIN services s ON s.id=a.service_id LEFT JOIN users c ON c.id=a.client_id where a.professional_id=$1 ORDER BY a.start_datetime ASC', [profesional_id])

    return professionalsAppointments.rows
}
export const completeAppointmentService = async (id_appointment, id_user) => {

    const searchAppointment = await pool.query('SELECT id,professional_id,status,start_datetime from appointments where id=$1', [id_appointment])
    if (searchAppointment.rows.length === 0) {
        throw new Error('APPOINTMENT_NOT_FOUND')
    }
    const profesionalContext = await pool.query('SELECT id,active from professionals where user_id=$1', [id_user])
    if (profesionalContext.rows.length === 0 || !profesionalContext.rows[0]?.active) {
        throw new Error('PROFESSIONAL_NOT_FOUND')
    }
    const appointment = searchAppointment.rows[0]
    if (profesionalContext.rows[0].id !== searchAppointment.rows[0].professional_id) {
        throw new Error('APPOINTMENT_IS_NOT_YOUR')
    }
    if (appointment.status.toLowerCase() !== 'confirmed') {
        throw new Error('APPOINTMENT_IS_NOT_CONFIRMED')
    }
    const fecha_actual=new Date()
    
    if (fecha_actual<appointment.start_datetime){
        throw new Error('APPOINTMENT_HAVE_NOT_BEEN')
    }
    const updateAppointment = await pool.query(`UPDATE appointments set status='completed' where id=$1 AND status = 'confirmed' RETURNING id,service_id,client_id,start_datetime,status`, [id_appointment])
    if(updateAppointment.rows.length===0){
        throw new Error('ERROR_TO_UPDATE')
    }
    console.log(profesionalContext.rows)
    return updateAppointment.rows[0]
}