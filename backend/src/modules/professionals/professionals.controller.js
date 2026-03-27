import { createProfessionalService, getAllProfesionalsService, getRequestProfessionalsService, getServicesByProfessionalIdService, profileProfessionalService, requestProfessionalServices, responseAdminReqService } from "./professionals.services.js"

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
export const profileProfessionalController = async (req, res) => {
    try {
        const data = await profileProfessionalService(req.user.id)
        res.json(data)
    } catch (e) {
        console.log('ERROR EN PROFILE PROFESSIONAL', e)
        if (e.message === 'PROFESSIONAL_PROFILE_NOT_FOUND') {
            return res.status(404).json({ message: 'Perfil de profesional no encontrado' })
        }
        return res.status(500).json({ message: 'error en server' })
    }
}

export const getAllProfesionals = async (req, res) => {
    try {
        const resul = await getAllProfesionalsService()
        res.json(resul)
    } catch (e) {
        console.log('ERROR AL OBTENER PROFESSIONALES PUBLICOS', e)
        return res.status(500).json({ message: 'Error en el server' })
    }
}
export const getServicesByProfessionalIdController = async (req, res) => {
    try {
        const result = await getServicesByProfessionalIdService(req.params.id)
        res.json(result)
    } catch (e) {
        console.log('ERROR AL OBTENER SERVICIOS FILTER PROF PUBLICOS', e)
        return res.status(500).json({ message: 'Error en el server' })
    }
}
export const requestProfessionalController = async (req, res) => {
    try {
        const resul = await requestProfessionalServices(req.user.id)
        res.json(resul)
    } catch (e) {
        console.log('ERROR EN LA SOLICITUD PARA SER PROFESIONAL', e)
        if (e.message === 'ALREADY_EXIST') {
            return res.status(409).json({ message: 'Ya tiene una solictud pendiente por aprobacion' })
        }
        if (e.message === 'USER_ALREADY_IS_PROFESSIONAL') {
            return res.status(409).json({ message: 'el usuario ya es profesional' })
        }
        return res.status(500).json({ message: 'error en el server' })
    }
}
export const responseAdminReqController = async (req, res) => {
    try {
        const result = await responseAdminReqService(req.params.id, req.body.status)
        res.json(result)
    } catch (e) {
        console.log('ERROR EN LA RESPUESTA PARA SER PROFESIONAL', e)
        if (e.message === 'REQUEST_NOT_FOUND') {
            return res.status(404).json({ message: 'la solicitud no se encuentra en la base de datos' })
        }
        if (e.message === 'ALREADY_RESPONSE') {
            return res.status(409).json({ message: 'la solicitud ya fue respondida' })
        }
        if (e.message === 'STATUS_NOT_VALID') {
            return res.status(401).json({ message: 'el estado no es valido' })
        }
        return res.status(500).json({ message: 'error en el server' })
    }
}
export const getRequestProfessionalsController = async (req, res) => {
    try {
        const result = await getRequestProfessionalsService()
        res.json(result)
    } catch (e) {
        console.log('ERROR AL OBTENER SOLICITUDES DE PROF', e)
        return res.status(500).json({ message: 'ERROR EN EL SERVER' })
    }
}