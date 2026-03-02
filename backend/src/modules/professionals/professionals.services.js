import { pool } from "../../config/db.js"
import { profileService } from "../profile/profile.services.js"

export const createProfessionalService=async(id_user,{bio,active,speciality})=>{
    if(!id_user){
        throw new Error('NOT_ONE_USER')
    }
    const alreadyExist=await pool.query('SELECT * FROM professionals where user_id=$1',[id_user])
    if(alreadyExist.rows.length>0){
        throw new Error('ALREADY_EXIST')
    }
    const result=await pool.query('INSERT INTO professionals(user_id,bio,active,speciality) VALUES($1,$2,$3,$4) RETURNING *',[id_user,bio.toLowerCase(),active,speciality.toLowerCase()])
    return result
    }

    export const profileProfessionalService=async(data)=>{
        const resul=await profileService(data)
        const dataProf=await pool.query('SELECT id,user_id,bio,active,speciality,created_at FROM professionals where user_id=$1',[data])
        if(dataProf.rows.length===0){
            throw new Error('PROFESSIONAL_PROFILE_NOT_FOUND')
        }
        const profSection=dataProf.rows[0]
        const userProfessional={...resul,profSection}
        return userProfessional
    }