import { type ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';
export type Role = 'admin' | 'client' | 'professional';

type ProtectedRouteProps = {
    children: ReactNode,
    rol: Role[]
}

export default function ProtectedRoute({ children, rol }: ProtectedRouteProps) {

    const { userReturned, token, loading } = useAuth()

    if (loading) {
        return <h1>Cargando</h1>
    }
    if (!userReturned || !token) {
        return <Navigate to="/login" replace />;
    }
    if (rol.length > 0 && !rol?.includes(userReturned.role)) {
        return <Navigate to="/unauthorized" replace />;
    }
    return children
}
