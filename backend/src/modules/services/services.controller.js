import { createServiceService, getMyServicesServices, serviceForProfessionalService, servicesForUsersServices } from "./services.services.js"

export const createServicesController = async (req, res) => {
    try {
        const result = await createServiceService(req.user.id, req.body)
        res.json(result)
    } catch (e) {
        console.log("ERROR AL CREAR SERVICIO", e)
        if (e.message === "ALREADY_EXIST_SERVICE") {
            return res.status(409).json({ message: 'El servicio que intenta crear ya existe para este profesional' })
        }
        if (e.message === "FORM_IMCOMPLET") {
            return res.status(400).json({ message: 'debe ingresar todos los campos del forumulario' })
        }
        if (e.message === "INCORRECT_INPUTS") {
            return res.status(400).json({ message: 'valida la duracion de la cita, precio o tiempo de espera entre cada cita' })
        }
        return res.status(500).json({ message: 'ERROR EN EL SERVIDOR' })
    }
}

export const getMyServicesController = async (req, res) => {
    try {
        const result = await getMyServicesServices(req.user.id)
        res.json({ servicios: result })
    } catch (e) {
        console.log("ERROR AL OBTENER SERRVICIOS", e)
        if (e.message === "PROFESSIONAL_NOT_FOUND") {
            return res.status(404).json({ message: 'Profesional no encotrado' })
        }
        if (e.message === "ID_NOT_FOUND") {
            return res.status(404).json({ message: 'Profesional no encotrado' })
        }
        return res.status(500).json({ message: 'Error en el servidor' })
    }
}

export const servicesForUsersController = async (req, res) => {
    try {
        const result = await servicesForUsersServices(req.params.id)
        res.json(result)
    } catch (e) {
        console.log("ERROR AL OBTENER SERRVICIOS", e)
        if (e.message === "SERVICE_NOT_FOUND") {
            return res.status(404).json({ message: 'servicio no encontrado' })
        }
        if (e.message === "SERVICE_NOT_AVAILABLE") {
            return res.status(409).json({ message: 'Servicio no disponible' })
        }
        return res.status(500).json({ message: 'Error en el servidor' })
    }
}
export const serviceForProfessionalController=async(req,res)=>{
    try{
        const result=await serviceForProfessionalService(req.params.id)
        res.json(result)
    }catch(e){
        console.log('ERROR AL OBTENER SERVICIO POR PROFESIONAL',e)
        if(e.message==="PROFESSIONAL_NOT_FOUND/NO_ACTIVATE"){
            return res.status(404).json({message:'Profesional no encontrado o desactivado'})
        }
        res.status(500).json({message:'error en el servidor'})
    }
}