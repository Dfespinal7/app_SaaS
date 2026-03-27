import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.token
        if (!token) {
            return res.status(401).json({ message: 'No autorizado, no existe' })
        }
        const decode=JWT.verify(token, process.env.TOKEN_SECRET)
        
        req.user = decode
        next()
    } catch (e) {
        console.log("ERROR EN MIDDLEWARE",e)
        return res.status(401).json({message:"Token invalido o expirado"})
    }
}