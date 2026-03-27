import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <>
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<Login></Login>}></Route>
        </Routes>
      </AuthProvider>
      </BrowserRouter>
    </>
  )
}

