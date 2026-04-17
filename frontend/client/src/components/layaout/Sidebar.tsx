import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { type classNameProps } from "./Topbar"
import { User } from "lucide-react";
export default function Sidebar({ className }: classNameProps) {
  const { userReturned, logout } = useAuth()
  const menus = {
    admin: [{ name: 'Dashboard', path: '/dashboard-admin/panel-admin', icon: '' }, { name: 'Usuarios', path: '/dashboard-admin/usuarios', icon: '' }, { name: 'Servicios', path: '/dashboard-admin/servicios', icon: '' }, { name: 'Mi perfil', path: '/dashboard-admin/profile', icon: '' },{ name: 'solicitudes', path: '/dashboard-admin/solicitudes', icon: '' }],
    client: [{ name: 'Dashboard', path: '/dashboard-client/panel-client', icon: User }, { name: 'Agendar cita', path: '/dashboard-client/agendar-cita', icon: '' }, { name: 'Mis citas', path: '/dashboard-client/mis-citas', icon: '' }, { name: 'Mi perfil', path: '/dashboard-client/profile', icon: '' }],
    professional: [{ name: 'Dashboard', path: '/dashboard-professional/panel-professional', icon: '' }, { name: 'Mi Agenda', path: '/dashboard-professional/agenda-professional', icon: '' }, { name: 'Disponibilidad', path: '/dashboard-professional/disponibilidad-professional', icon: '' }, { name: 'Mi perfil', path: '/dashboard-professional/profile', icon: '' }]
  }
  const menu = userReturned ? menus[userReturned.role] : []


  return (
    <div className={className}>
      <div className="rounded-lg bg-gray-100 px-3 flex flex-col justify-between items-center py-5 w-30">
        <h1 className="text-xl font-bold ">{userReturned?.name}</h1>
        <h1 className="text-lg font-light ">{userReturned?.role}</h1>
      </div>
      <ul className="flex-1 rounded-lg bg-gray-100 px-3 flex flex-col justify-between py-5">
        {
          menu.map((item, index) => (
            <li key={index}><NavLink to={item.path} className={({ isActive }) => 
              `p-2 rounded-lg font-semibold transition-all duration-300 block ${isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`
            }>{item.name}</NavLink></li>
          ))
        }
      </ul>
      <button onClick={logout} className='p-2 my-4 rounded-lg bg-red-500 font-bold text-white cursor-pointer hover:scale-105 transition-all duration-500'>logout</button>
    </div>
  )
}
