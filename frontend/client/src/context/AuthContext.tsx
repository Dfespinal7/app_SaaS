import { useContext,createContext, type ReactNode } from "react";
type ContextProps={
    user:string
}
type AuthProviderProps={
    children:ReactNode
}
const AuthContext=createContext<ContextProps|null>(null)

export const useAuth=()=>{
    const context=useContext(AuthContext)
    if(!context)throw new Error('Error al obtener contexto')
    return context
}

export const AuthProvider=({children}:AuthProviderProps)=>{
    return(
        <AuthContext.Provider value={{user:'Daniel'}}>
            {children}
        </AuthContext.Provider>
    )
}