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

export const getAllProfesionalsService=async()=>{
    const getProfessionals=await pool.query('SELECT p.id,u.name AS name_profesional,p.bio,p.active,p.speciality FROM professionals p INNER JOIN users u ON p.user_id=u.id')
    return getProfessionals.rows
}
export const getServicesByProfessionalIdService=async(id_professional)=>{
    const getServices=await pool.query('SELECT id,name,description,duration_minutes,price,active FROM services where professional_id=$1',[id_professional])
    return getServices.rows
}
export const requestProfessionalServices=async(user_id)=>{
    
    const alreadyExistRegister=await pool.query('SELECT id,status FROM professional_request')
    if(alreadyExistRegister.rows[0]?.status.toLowerCase()==='pending'){
        throw new Error('ALREADY_EXIST')
    }
    const createRequest=await pool.query('INSERT INTO professional_request(user_id)values($1) RETURNING *',[user_id])
    const solicitud=createRequest.rows[0]
    return {message:'Solicitud enviada correctamente',solicitud}
}
//ya se creo el endpoint de solicitud para ser profesional
//crear endpoint donde el admin aprueba o desaprueba la solicidud, 
// si es denegada, que el rol de usuario siga siento cliente y el estado de la solicitud pase a ser rejected
//si es aprobada, que el registro de la solicitud pase a ser approved y que el rol del usuario cambie a profesional 
// y se cree registro en tabla profesional 