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
    const validSlot=await pool.query(`SELECT id FROM appointments where professional_id=$1 AND status<>'canceled' AND (start_datetime<$2 AND end_datetime >$3)`,[professional_id,end,start])
    if(validSlot.rows.length>0){
        throw new Error('SLOT_CONFLICT')
    }
    
    const response=await pool.query('INSERT INTO appointments(service_id,professional_id,start_datetime,end_datetime,status,notes)VALUES($1,$2,$3,$4,$5,$6) RETURNING service_id,professional_id,start_datetime,end_datetime,status,notes',[service_id,professional_id,start_datetime,end_datetime,status,notes])
    return response.rows
}
export const getAppointmentsForServiceService=async(id)=>{
    if(!id){
        throw new Error('PARAM_NOT_VALID')
    }
    const validService=await pool.query('SELECT id,active FROM services where id=$1',[id])
    if(validService.rows.length===0 || !validService.rows[0].active){
        throw new Error('SERVICE_NOT_FOUND')
    }
    const fecha_actual=new Date
    const query=await pool.query(`SELECT id,service_id,client_id,start_datetime,end_datetime,status,notes FROM appointments WHERE service_id=$1 AND start_datetime>$2 AND status = 'available' ORDER BY start_datetime ASC`,[id,fecha_actual])
    return query.rows
}