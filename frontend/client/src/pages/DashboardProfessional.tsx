import { useAuth } from '../context/AuthContext'

export default function DashboardProfessional() {
  const {logout}=useAuth()
  return (
    <div>
      dashboar prof
      <button onClick={logout} className='p-2 rounded-lg bg-red-500 font-bold text-white'>logout</button>
    </div>
  )
}
