import { profileService } from "./profile.services.js"

export const profileController=async(req,res)=>{
    try{
        const result=await profileService(req.user.id)
        res.json(result)
    }catch(e){
        console.log('ERROR EN PROFILE',e)
        if(e.message==='USER_NOT_FOUND'){
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }
        res.status(500).json({message:'Error en server interno'})
    }
}