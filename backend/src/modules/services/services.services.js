import { pool } from "../../config/db.js"

export const createServiceService = async (id, body) => {
    const searchProfessional = await pool.query('SELECT id FROM professionals where user_id=$1', [id])
    
    const professional_id = searchProfessional.rows[0]?.id
    if (!professional_id) {
        throw new Error('PROFESSIONAL_PROFILE_NOT_FOUND')
    }
    const { name, description, duration_minutes, price, buffer_time_minutes, active } = body
    if (!name || !description || !duration_minutes || price === undefined || price === null || buffer_time_minutes === undefined || buffer_time_minutes === null) {
        throw new Error('FORM_IMCOMPLET')
    }
    if (duration_minutes <= 0 || price <= 0 || buffer_time_minutes < 0) {
        throw new Error('INCORRECT_INPUTS')
    }
    const searchService = await pool.query('select name,professional_id from services where name=$1 and professional_id=$2', [name.toLowerCase(), professional_id])
    if (searchService.rows[0]) {
        throw new Error('ALREADY_EXIST_SERVICE')
    }
    const addServices = await pool.query('INSERT INTO services(professional_id,name, description, duration_minutes, price, buffer_time_minutes, active)VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *', [professional_id, name.toLowerCase(), description.toLowerCase(), duration_minutes, price, buffer_time_minutes, active])

    return addServices.rows[0]
}