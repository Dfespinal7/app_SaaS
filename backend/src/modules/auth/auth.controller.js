import { pool } from "../../config/db.js"
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'
import { loginUser, profileUserService, registerUser } from "./auth.services.js"
dotenv.config()

export const register = async (req, res) => {

    try {
        const { user, token } = await registerUser(req.body)
        res.cookie('token', token)
        res.status(201).json({ message: "usuario registrado correctamente", user, token })
    } catch (e) {
        console.log("ERROR REAL:", e)
        if (e.message === "Rol invalido") {
            return res.status(400).json({ message: "Rol no permitido" })
        }
        if (e.message === "MISSING_FIELDS") {
            return res.status(400).json({ message: "debe ingresar todos los campos" })
        }
        if (e.message === "El usuario ya existe en la base de datos") {
            return res.status(409).json({ message: "El usuario ya existe en la base de datos" })
        }
        return res.status(500).json({ message: "Error en la solicitud" })
    }
}

export const login = async (req, res) => {
    try {
        const { user, token } = await loginUser(req.body)
        console.log(user, token)
        res.cookie("token", token)
        res.status(200).json({ message: 'Bienvenido user', user, token })
    } catch (e) {
        console.log("ERROR REAL:", e)
        if (e.message === "WITHOUT_CREDENTIALS") {
            return res.status(400).json({ message: "Debe ingresar usuario y contraseña" })
        }
        if (e.message === "EMAIL_NOT_EXIST") {
            return res.status(401).json({ message: "El email no se encuntra registrado" })
        }
        if (e.message === "INCORRECT_PASSWORD") {
            return res.status(401).json({ message: "la contraseña es incorrecta" })
        }


        return res.status(500).json({ message: "Error en la solicitud" })
    }

}
export const logout = (req, res) => {
    try {
        res.clearCookie("token")
        res.json({ message: 'sesion cerrada correctamente' })
    } catch (e) {
        console.log('ERROR EN LOGOUT', e)
        return res.status(500).json({ message: 'error en el server' })
    }
}
export const profileControllerUser = async (req, res) => {
    try {
        const result = await profileUserService(req.user.id)
        res.json(result)
    } catch (e) {
        console.log('ERROR EN obtener perfil', e)
        if(e.message==='USER_NOT_FOUND'){
            return res.status(404).json({ message: 'usuario no encontrado' })
        }
        return res.status(500).json({ message: 'error en el server' })
    }
}