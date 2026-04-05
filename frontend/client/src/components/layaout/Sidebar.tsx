import { useAuth } from "../../context/AuthContext"
import { type classNameProps } from "./Topbar"
export default function Sidebar({ className }: classNameProps) {
  const { userReturned,logout } = useAuth()
  const menus = {
    admin: [{ name: 'Dashboard', path: '', icon: '' }, { name: 'Usuarios', path: '', icon: '' }, { name: 'Servicios', path: '', icon: '' }],
    client: [{ name: 'Dashboard', path: '', icon: '' }, { name: 'Agendar cita', path: '', icon: '' }, { name: 'Mis citas', path: '', icon: '' }],
    professional: [{ name: 'Dashboard', path: '', icon: '' }, { name: 'Agenda', path: '', icon: '' }, { name: 'disponibilidad', path: '', icon: '' }]
  }
  const menu = userReturned ? menus[userReturned.role] : []


  return (
    <div className={className}>
      <div>
        <h1 className="text-xl font-bold ">Dashboard</h1>
        <h1 className="text-xl font-bold ">{userReturned?.role}</h1>
      </div>
      <ul className=" h-80 flex flex-col justify-between py-5">
        {
          menu.map((item, index) => (
            <li key={index} className="p-0.5 rounded-lg font-semibold hover:scale-105 transition-all  duration-500 cursor-pointer hover:bg-gray-200">{item.name}</li>
          ))
        }
      </ul>
      <button onClick={logout} className='p-2 rounded-lg bg-red-500 font-bold text-white cursor-pointer hover:scale-105 transition-all duration-500'>logout</button>
    </div>
  )
}
