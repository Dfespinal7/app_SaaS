import { pool } from "../../config/db.js"
import { createAppointmentsService } from "./appointments.services.js"

export const createAppointmentController=async(req,res)=>{
    try{
        const result=await createAppointmentsService(req.body,req.user.id)
    
    res.json(result)
    }catch(e){
        console.log('ERROR AL CREAR AGENDA',e)
        res.status(500).json({message:'error en el server'})
    }
}