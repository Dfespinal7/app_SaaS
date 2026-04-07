import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import DashboardAdmin from './pages/DashboardAdmin'
import DashboardProfessional from './pages/DashboardProfessional'
import DashboardClient from './pages/DashboardClient'
import DashboardLayout from './components/layaout/DashboardLayout'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/login' element={<Login></Login>}></Route>
            <Route path='/unauthorized' element={<h1>No tiene autorizacion para ingresar a esta sesion</h1>}></Route>
            <Route path='/dashboard-admin' element={<ProtectedRoute rol={["admin"]}><DashboardLayout></DashboardLayout></ProtectedRoute>}>
              <Route path='panel-admin' element={<DashboardAdmin></DashboardAdmin>}></Route>
              <Route path='usuarios' element={<h1>usuarios admin por definir</h1>}></Route>
              <Route path='profile' element={<h1>perfil para todos los roles por definir</h1>}></Route>
              <Route path='servicios' element={<h1>servicios admin por definir</h1>}></Route>
            </Route>
            <Route path='/dashboard-professional' element={<ProtectedRoute rol={["professional"]}><DashboardLayout></DashboardLayout></ProtectedRoute>}>
              <Route path='panel-professional' element={<DashboardProfessional></DashboardProfessional>}></Route>
              <Route path='agenda-professional' element={<h1>agenda professional por definir</h1>}></Route>
              <Route path='disponibilidad-professional' element={<h1>Disponibilidad professional por definir</h1>}></Route>
              <Route path='profile' element={<h1>perfil para todos los roles por definir</h1>}></Route>
            </Route>
            <Route path='/dashboard-client' element={<ProtectedRoute rol={["client"]}><DashboardLayout></DashboardLayout></ProtectedRoute>}>
              <Route path='panel-client' element={<DashboardClient></DashboardClient>}></Route>
              <Route path='profile' element={<h1>perfil para todos los roles por definir</h1>}></Route>
              <Route path='agendar-cita' element={<h1>agendar cita cliente por definir</h1>}></Route>
              <Route path='mis-citas' element={<h1>mis citas clientes por definir</h1>}></Route>
              
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

