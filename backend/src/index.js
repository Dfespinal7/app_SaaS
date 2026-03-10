import express from 'express'//express es la libreria que permite crear servidor y rutas
import morgan from 'morgan'// es la libreria que me muestra por consola las peticiones y los status de las solicitudes al srrvidor
import cors from 'cors'
import dotenv from 'dotenv' //IMPORTAMOS LIBRERIAS NECESARIAS PARA EL DESARROLLO
import cookieParser from 'cookie-parser'

import { userRouter } from './routes/user.routes.js'
import { authRoutes } from './modules/auth/auth.routes.js'
import { profileRoutes } from './modules/profile/profile.routes.js'
import { professionalsRoutes } from './modules/professionals/professionals.routes.js'
import { servicesRoutes } from './modules/services/services.routes.js'
import { appointmentRoutes } from './modules/appointments/appointments.routes.js'

const app=express() //creamos la aplicacion, ahora app es mi servidor
dotenv.config()
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))//aqui le especificamos a morgan que queremos que nos trate como dev
app.use(cors({

}))

app.use(userRouter)//le decimos a nuestra app, que vamos a usar esta const de rutas
app.use(authRoutes)
app.use(profileRoutes)
app.use(professionalsRoutes)
app.use(servicesRoutes)
app.use(appointmentRoutes)

app.get('/',(req,res)=>{
    res.json({message:'funciona'})
})
const PORT=process.env.PORT//definimos PORT en una constante
app.listen(PORT,()=>{//definimos el listen, que es el puerto de nuestro local host donde queremos correr el server y una funcion flecha que imprime algo
    console.log(`SERVER ${PORT} IS RUNNING`)
})