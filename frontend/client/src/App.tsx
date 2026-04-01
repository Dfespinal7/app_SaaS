import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import DashboardAdmin from './pages/DashboardAdmin'
import DashboardProfessional from './pages/DashboardProfessional'
import DashboardClient from './pages/DashboardClient'

export default function App() {
  return (
    <>
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/test' element={<ProtectedRoute rol={["client"]}><h1>soy el children</h1></ProtectedRoute>}></Route>
          <Route path='/unauthorized' element={<h1>No tiene autorizacion para ingresar a esta sesion</h1>}></Route>
          <Route path='/dashboard-admin' element={<ProtectedRoute rol={["admin"]}><DashboardAdmin></DashboardAdmin></ProtectedRoute>}></Route>
          <Route path='/dashboard-professional' element={<ProtectedRoute rol={["professional"]}><DashboardProfessional></DashboardProfessional></ProtectedRoute>}></Route>
          <Route path='/dashboard-client' element={<ProtectedRoute rol={["client"]}><DashboardClient></DashboardClient></ProtectedRoute>}></Route>
        </Routes>
      </AuthProvider>
      </BrowserRouter>
    </>
  )
}

