import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ProfileComponen() {
  const { userReturned, requestToBeProfessional,status,handleStatus } = useAuth()
    console.log()
  useEffect(() => {
    if (userReturned?.role === 'client') {
      handleStatus()
    }

  }, [])
  return (
    <div className='flex flex-col justify-center items-center  w-full h-full'>
      <div className='size-100 flex flex-col justify-between items-center py-5 gap-3 rounded-lg bg-gray-100 shadow-md'>
        <span className='size-20 bg-gray-300 rounded-full font-bold text-white flex justify-center items-center text-3xl'>{userReturned?.name?.charAt(0).toUpperCase()}</span>
        <h1 className='font-bold text-2xl text-gray-500'>{userReturned?.name}</h1>
        <h1 className='font-semibold text-2xl text-gray-500'>{userReturned?.email}</h1>
        <h1 className='font-light text-2xl text-gray-500'>{userReturned?.role}</h1>
        {
          userReturned?.role === 'client' ? <button onClick={requestToBeProfessional} disabled={status} className={status ? 'font-bold bg-gray-400 text-white p-2 rounded-lg cursor-not-allowed' : 'font-bold bg-blue-400 text-white p-2 rounded-lg cursor-pointer'}>{status ? 'Solicitud pendiente' : 'Solicitar ser profesional'}</button> : ''
        }
      </div>


    </div>
  )
}
