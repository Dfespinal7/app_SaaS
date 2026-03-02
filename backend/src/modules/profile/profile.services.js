import { pool } from "../../config/db.js"

export const profileService=async(data)=>{
    
    const response=await pool.query('SELECT id,name,email,role FROM users where id=$1',[data])
    if(response.rows.length===0){
        throw new Error('USER_NOT_FOUND')
    }
    const user=response.rows[0]
    return user
}