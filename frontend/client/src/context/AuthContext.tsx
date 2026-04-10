import { useContext, createContext, type ReactNode, useState, useEffect } from "react";
import Swal from "sweetalert2";
import type { Role } from "../routes/ProtectedRoute";
import { useNavigate } from "react-router-dom";
type ContextProps = {
    handleChangeInputLogin: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSubmitLogin: (e: React.FormEvent<HTMLFormElement>) => void
    userLogin: UserLoginProps
    logout: () => void
    token: string | null
    userReturned: UserReturnedProps | null
    loading: boolean
    requestToBeProfessional: () => void
    handleStatus:()=>void
    status:boolean
}
type AuthProviderProps = {
    children: ReactNode
}
type UserLoginProps = {
    email: string
    password_hash: string
}
type UserReturnedProps = {
    id: number
    name: string
    email: string
    role: Role

}
const AuthContext = createContext<ContextProps | null>(null)//creamos el contexto y lo guardanmos en una constante

export const useAuth = () => {//creamos una funcion que usa el contexto y la expoertamos para poderla usar en otros componentes
    const context = useContext(AuthContext)
    if (!context) throw new Error('Error al obtener contexto')
    return context
}

export const AuthProvider = ({ children }: AuthProviderProps) => {// componente que envuelve y reparte el contexto
    const [userLogin, setUserLogin] = useState<UserLoginProps>({ email: '', password_hash: '' })
    const [token, setToken] = useState<string | null>(null)
    const [userReturned, setUserReturned] = useState<UserReturnedProps | null>(null)
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState(false)

    const navigate = useNavigate()

    const handleChangeInputLogin = (e: React.ChangeEvent<HTMLInputElement>) => {//funcion que al cambiar input le da value al objeto de userLogin
        const { name, value } = e.target
        setUserLogin({ ...userLogin, [name]: value })
    }
    const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {//boton que envia formulario y valida datos y direccionamiento
        e.preventDefault()
        const result = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userLogin),
            credentials: 'include'
        })
        const data = await result.json() //guardamos en constante la respuesta del server
        if (!result.ok) {//si no se puede iniciar sesion, muestra ventana con mensaje
            Swal.fire({
                icon: 'error',
                title: 'Error al loguearse',
                text: data.message,
                showConfirmButton: false,
                timer: 2000
            })
            if (data.message === "la contraseña es incorrecta") {
                setUserLogin({ ...userLogin, password_hash: '' })
                return
            }
            setUserLogin({ email: '', password_hash: '' })
            return
        }
        setUserLogin({ email: '', password_hash: '' })//seteamos objeto de login, por seguridad no es bueno tener esta info guardada
        Swal.fire({
            icon: 'success',
            title: 'Todo salió bien',
            text: data.message,
            showConfirmButton: false,
            timer: 2000
        })

        setUserReturned(data.user)
        setToken(data.token)
        setLoading(false)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))


        navigate(`/dashboard-${data.user.role}`)

    }
    const logout = async () => {//funcion para cerrar sesion y limpiar localStorage y cookies
        const questionLogout = await Swal.fire({
            icon: 'info',
            title: 'Seguro que desea cerrar sesión?',
            showCancelButton: true
        })

        if (questionLogout.isConfirmed) {
            const response = await fetch('http://localhost:5000/auth/logout', {
                method: 'POST',
                credentials: 'include'
            })
            const data = await response.json()
            if (!response.ok) {
                console.log(data.message)
                Swal.fire({
                    icon: 'error',
                    title: 'error al cerrar sesion',
                    text: data.message,
                    showConfirmButton: false,
                    timer: 2000
                })
                return
            }
            setUserReturned(null)
            setUserLogin({ email: '', password_hash: '' })
            setToken(null)
            setLoading(false)
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            Swal.fire({
                icon: 'success',
                title: 'Todo salió bien',
                text: data.message,
                showConfirmButton: false,
                timer: 2000
            })
            navigate('/login')
        }

    }
    const handleStatus = async () => {
        const result = await fetch('http://localhost:5000/professional/request/status', {
            method: 'GET',
            credentials: 'include'
        })
        const data = await result.json()
        setStatus(data)
    }
    const requestToBeProfessional = async () => {
        const rol = userReturned?.role
        if (!rol || rol !== 'client') {
            Swal.fire({
                icon: 'info',
                text: 'Solo los clientes pueden hacer esta solicitud',
                showConfirmButton: false,
                timer: 2000
            })
            return
        }
        const request = await Swal.fire({
            icon: 'info',
            text: 'Seguro que desea enviar la solicitud para ser profesional?',
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: 'red'
        })
        if (request.isConfirmed) {
            const response = await fetch('http://localhost:5000/professional/request', {
                method: 'POST',
                credentials: 'include'
            })
            const data = await response.json()
            if (!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Algo salió mal!',
                    text: data.message,
                    showConfirmButton: false,
                    timer: 2000
                })
                return
            }
            await handleStatus()
            Swal.fire({
                icon: 'success',
                title: 'Todo salió bien!',
                text: data.message,
                showConfirmButton: false,
                timer: 2000
            })

        }

    }
    useEffect(() => {
        const tokenStore = localStorage.getItem('token');
        const userStore = localStorage.getItem('user');

        if (tokenStore && userStore) {
            setToken(tokenStore);
            setUserReturned(JSON.parse(userStore));
        }

        // 🔥 IMPORTANTE: terminar carga SIEMPRE
        setLoading(false);
    }, []);
    return (
        <AuthContext.Provider value={{handleStatus,status, handleChangeInputLogin, handleSubmitLogin, userLogin, logout, token, userReturned, loading, requestToBeProfessional }}>
            {children}
        </AuthContext.Provider>
    )
}