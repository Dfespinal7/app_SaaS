import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function DashboardClient() {
  const{logout}=useAuth()
  return (
    <div>DashboardClient
      <button onClick={logout} className='p-2 rounded-lg bg-red-500 font-bold text-white'>logout</button>
    </div>
  )
}
