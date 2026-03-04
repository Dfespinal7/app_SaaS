import { createServiceService } from "./services.services.js"

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