import { pool } from "../config/db.js"

export const getAllusers=async(req,res)=>{
    const result=await pool.query('SELECT * FROM USERS')
    res.json(result.rows)
}