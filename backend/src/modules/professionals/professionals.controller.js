import { createProfessionalService, profileProfessionalService } from "./professionals.services.js"

export const createProfessionalController = async (req, res) => {
    try {
        const result = await createProfessionalService(req.user.id, req.body)
        res.json({ message: result.rows })
    } catch (e) {
        console.log('ERROR EN PROFESIONAL CONTROLLER', e)
        if (e.message === 'NOT_ONE_USER') {
            return res.status(401).json({ message: 'Ingrese el user_id' })
        }
        if (e.message === 'ALREADY_EXIST') {
            return res.status(409).json({ message: 'Ya existe un profesional con este id_user' })
        }
        return res.status(500).json({ message: 'Error en el servidor' })
    }
}
export const profileProfessionalController=async(req,res)=>{
    try{
        const data=await profileProfessionalService(req.user.id)
        res.json(data)
    }catch(e){
        console.log('ERROR EN PROFILE PROFESSIONAL',e)
        if(e.message==='PROFESSIONAL_PROFILE_NOT_FOUND'){
            return res.status(404).json({message:'Perfil de profesional no encontrado'})
        }
        return res.status(500).json({message:'error en server'})
    }
}