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
              <Route index element={<DashboardAdmin></DashboardAdmin>}></Route>
            </Route>
            <Route path='/dashboard-professional' element={<ProtectedRoute rol={["professional"]}><DashboardLayout></DashboardLayout></ProtectedRoute>}>
              <Route index element={<DashboardProfessional></DashboardProfessional>}></Route>
            </Route>
            <Route path='/dashboard-client' element={<ProtectedRoute rol={["client"]}><DashboardLayout></DashboardLayout></ProtectedRoute>}>
              <Route index element={<DashboardClient></DashboardClient>}></Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

