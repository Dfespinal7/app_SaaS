import { pool } from "../../config/db.js"
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const registerUser = async ({ name, email, password_hash, role }) => {
    if (!name || !email || !password_hash || !role) {
        throw new Error("MISSING_FIELDS")
    }
    const allowedRoles = ["client", "admin", "professional"]
    if (!allowedRoles.includes(role.toLowerCase())) {
        throw new Error("Rol invalido")
    }
    const userExist = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email.toLowerCase()] 
    )
    if (userExist.rows.length > 0) {
        throw new Error("El usuario ya existe en la base de datos")
    }
    const passwordHash = await bcrypt.hash(password_hash, 10)
    const result = await pool.query(
        `INSERT INTO users(name,email,password_hash,role)
         VALUES($1,$2,$3,$4)
         RETURNING id,name,email,role`,
        [name.toLowerCase(), email.toLowerCase(), passwordHash, role.toLowerCase()]
    )
    const user = result.rows[0]
    const token = JWT.sign(
        { id: user.id, role: user.role },
        process.env.TOKEN_SECRET,
        { expiresIn: "1d" }
    )
    return { user, token }
}

export const loginUser = async ({ email, password_hash }) => {
    if(!email||!password_hash){
        throw new Error('WITHOUT_CREDENTIALS')
    }
    const validEmail=await pool.query('SELECT * FROM users where email=$1',[email.toLowerCase()])
    if(validEmail.rows.length===0){
        throw new Error('EMAIL_NOT_EXIST')
    }
    const user=validEmail.rows[0]
    const validPassword=await bcrypt.compare(password_hash,user.password_hash)
    if(!validPassword){
        throw new Error('INCORRECT_PASSWORD')
    }
    const token = JWT.sign({ id: user.id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: '1d' })
    return {user:{id:user.id,name:user.name,email:user.email,role:user.role},token}
}