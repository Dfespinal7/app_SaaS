import { pool } from "../../config/db.js"
import { profileService } from "../profile/profile.services.js"

export const createProfessionalService = async (id_user, { bio, active, speciality }) => {
    if (!id_user) {
        throw new Error('NOT_ONE_USER')
    }
    const alreadyExist = await pool.query('SELECT * FROM professionals where user_id=$1', [id_user])
    if (alreadyExist.rows.length > 0) {
        throw new Error('ALREADY_EXIST')
    }
    const result = await pool.query('INSERT INTO professionals(user_id,bio,active,speciality) VALUES($1,$2,$3,$4) RETURNING *', [id_user, bio.toLowerCase(), active, speciality.toLowerCase()])
    return result
}

export const profileProfessionalService = async (data) => {
    const resul = await profileService(data)
    const dataProf = await pool.query('SELECT id,user_id,bio,active,speciality,created_at FROM professionals where user_id=$1', [data])
    if (dataProf.rows.length === 0) {
        throw new Error('PROFESSIONAL_PROFILE_NOT_FOUND')
    }
    const profSection = dataProf.rows[0]
    const userProfessional = { ...resul, profSection }
    return userProfessional
}

export const getAllProfesionalsService = async () => {
    const getProfessionals = await pool.query('SELECT p.id,u.name AS name_profesional,p.bio,p.active,p.speciality FROM professionals p INNER JOIN users u ON p.user_id=u.id')
    return getProfessionals.rows
}
export const getServicesByProfessionalIdService = async (id_professional) => {
    const getServices = await pool.query('SELECT id,name,description,duration_minutes,price,active FROM services where professional_id=$1', [id_professional])
    return getServices.rows
}
export const requestProfessionalServices = async (user_id) => {
    const validProf = await pool.query('select * from professionals where user_id=$1', [user_id])
    if (validProf.rows.length > 0) {
        throw new Error('USER_ALREADY_IS_PROFESSIONAL')
    }
    const alreadyExistRegister = await pool.query(`SELECT id,status FROM professional_request where user_id=$1 AND status='pending'`, [user_id])
    if (alreadyExistRegister.rows.length > 0) {
        throw new Error('ALREADY_EXIST')
    }
    const createRequest = await pool.query('INSERT INTO professional_request(user_id,status)values($1,$2) RETURNING *', [user_id, "pending"])
    const solicitud = createRequest.rows[0]
    return { message: 'Solicitud enviada correctamente', solicitud }
}
export const responseAdminReqService = async (id_request, status) => {

    if (!status) {
        throw new Error('THERE_IS_NOT_A_STATUS')
    }

    const allowed = ["approved", "rejected"]
    if (!allowed.includes(status.toLowerCase())) {
        throw new Error('STATUS_NOT_VALID')
    }

    // validar request exista
    const validRequest = await pool.query(
        'SELECT id,status,user_id FROM professional_request WHERE id=$1',
        [id_request]
    )

    if (validRequest.rows.length === 0) {
        throw new Error('REQUEST_NOT_FOUND')
    }

    const request = validRequest.rows[0]

    // validar que siga pending
    if (request.status.toLowerCase() !== 'pending') {
        throw new Error('ALREADY_RESPONSE')
    }

    // si aprueba validar que no exista professional
    if (status.toLowerCase() === 'approved') {
        const validIfAlreadyExistProf = await pool.query(
            'SELECT id FROM professionals WHERE user_id=$1',
            [request.user_id]
        )

        if (validIfAlreadyExistProf.rows.length > 0) {
            throw new Error('USER_ALREADY_IS_PROFESSIONAL')
        }
    }

    // rejected
    if (status.toLowerCase() === 'rejected') {
        const updateRequest = await pool.query(
            'UPDATE professional_request SET status=$1 WHERE id=$2 RETURNING *',
            [status.toLowerCase(), id_request]
        )

        return {
            message: 'Solicitud rechazada',
            solicitud: updateRequest.rows[0]
        }
    }

    // approved
    const updateRequest = await pool.query(
        'UPDATE professional_request SET status=$1 WHERE id=$2 RETURNING *',
        [status.toLowerCase(), id_request]
    )

    const id_user = request.user_id

    await pool.query(
        `UPDATE users SET role='professional' WHERE id=$1`,
        [id_user]
    )

    const createProfessional = await pool.query(
        `INSERT INTO professionals(user_id,active,speciality)
         VALUES($1,$2,$3) RETURNING *`,
        [id_user, true, "undefined"]
    )

    return {
        message: 'solicitud aprobada',
        profesional: createProfessional.rows[0]
    }
}
export const getRequestProfessionalsService = async () => {
    const getAllResquest = await pool.query('SELECT pr.id, u.email as email_usuario,pr.status,pr.notes,pr.created_at  FROM professional_request pr INNER JOIN users u ON u.id=pr.user_id')
    return getAllResquest.rows
}

export const getStatusRequestService=async(user_id)=>{
    const validStatus=await pool.query(`Select status from professional_request where user_id=$1 and status='pending'`,[user_id])
    if(validStatus.rows.length>0){
        return true
    }
    return false
}