import { useContext, createContext, type ReactNode, useState, useEffect } from "react";
import Swal from "sweetalert2";
type ContextProps = {
    handleChangeInputLogin: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSubmitLogin: (e: React.FormEvent<HTMLFormElement>) => void
    userLogin: UserLoginProps
    logout: () => void
    token: string|null
    userReturned:UserReturnedProps|null
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
    role: string

}
const AuthContext = createContext<ContextProps | null>(null)//creamos el contexto y lo guardanmos en una constante

export const useAuth = () => {//creamos una funcion que usa el contexto y la expoertamos para poderla usar en otros componentes
    const context = useContext(AuthContext)
    if (!context) throw new Error('Error al obtener contexto')
    return context
}

export const AuthProvider = ({ children }: AuthProviderProps) => {// componente que envuelve y reparte el contexto
    const [userLogin, setUserLogin] = useState<UserLoginProps>({ email: '', password_hash: '' })
    const [token, setToken] = useState<string|null>(null)
    const [userReturned, setUserReturned] = useState<UserReturnedProps | null>(null)

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
        console.log('data', data)
        setUserReturned(data.user)
        setToken(data.token)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
    }
    const logout = async () => {//funcion para cerrar sesion y limpiar localStorage y cookies
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
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        Swal.fire({
            icon: 'success',
            title: 'Todo salió bien',
            text: data.message,
            showConfirmButton: false,
            timer: 2000
        })
    }
    useEffect(() => {//funcion que al recargar la pg, recupera y no 'olvida' el token y el usuario que esta autenticado
        const tokenStore = localStorage.getItem('token')
        const userStore = localStorage.getItem('user')
        if (!tokenStore || !userStore) {
            console.log('item no encontrado en local store')
            return
        }
        setToken(tokenStore)
        setUserReturned(JSON.parse(userStore))
    }, [])
    return (
        <AuthContext.Provider value={{ handleChangeInputLogin, handleSubmitLogin, userLogin, logout, token,userReturned }}>
            {children}
        </AuthContext.Provider>
    )
}