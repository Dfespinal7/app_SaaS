import { Briefcase, BriefcaseMedical, Calendar, DollarSign, Edit2Icon, Notebook, ShieldCheck, Timer, Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
export type ServicesProps = {
  id: number
  professional_id: number
  name: string
  description: string
  duration_minutes: number
  price: number
  buffer_time_minutes: number
  active: boolean
}
export default function ListMyServices() {
  const [allServices, setAllServices] = useState<ServicesProps[]>([])
  const getAllServices = async () => {
    const result = await fetch('http://localhost:5000/services/me', {
      method: 'GET',
      credentials: 'include'
    })
    const data = await result.json()
    setAllServices(data.servicios)

  }
  const serviciosActivosLength = allServices?.filter(serv => serv.active === true)
  const totalMin = allServices?.reduce((acc, serv) => {
    acc += serv.duration_minutes
    return acc
  }, 0)
  const minProm = totalMin && allServices?.length ? totalMin / allServices?.length : 0
  const totalPrice = allServices?.reduce((acc, serv) => {
    acc += serv.price
    return acc
  }, 0)
  const promPrice = totalPrice / allServices?.length

  useEffect(() => {
    getAllServices()
  }, [])
  return (
    <div className=' w-full flex flex-col gap-1'>
      <div className='h-[10%]  flex px-3 items-center justify-between'>
        <div className=''>
          <h1 className='font-bold text-xl'>Mis servicios</h1>
          <p className='text-sm text-gray-500 font-medium'>Gestiona los servicios que ofreces a tus clientes</p>
        </div>
        <Link to={'/dashboard-professional/form-services'}><button className='px-2 py-1 rounded-lg bg-blue-400 font-bold text-white cursor-pointer hover:scale-105 transition-all duration-500'>Crear nuevo servicio</button></Link>
      </div>
      <div className='h-[20%]  grid grid-cols-4 px-2 gap-2'>
        <div className='border rounded-lg border-gray-300 shadow-xs flex px-3 hover:scale-102 transition-all duration-500'>
          <div className=' w-[25%] flex justify-center items-center'>
            <span className='rounded-full bg-blue-100 size-14 flex justify-center items-center'><Notebook className='text-blue-500'></Notebook></span>
          </div>
          <div className=' w-full flex flex-col justify-center px-2'>
            <span className='text-sm font-medium text-gray-600'>Total servicios</span>
            <h1 className='font-bold text-xl'>{allServices?.length}</h1>
            <span className='text-sm font-medium text-gray-600'>Servicios creados</span>
          </div>
        </div>
        <div className='border rounded-lg border-gray-300 shadow-xs flex px-3 hover:scale-102 transition-all duration-500'>
          <div className=' w-[25%] flex justify-center items-center'>
            <span className='rounded-full bg-green-100 size-14 flex justify-center items-center'><ShieldCheck className='text-green-500'></ShieldCheck></span>
          </div>
          <div className=' w-full flex flex-col justify-center px-2'>
            <span className='text-sm font-medium text-gray-600'>Activos</span>
            <h1 className='font-bold text-xl'>{serviciosActivosLength?.length}</h1>
            <span className='text-sm font-medium text-gray-600'>Servicios disponibles</span>
          </div>
        </div>
        <div className='border rounded-lg border-gray-300 shadow-xs flex px-3 hover:scale-102 transition-all duration-500'>
          <div className=' w-[25%] flex justify-center items-center'>
            <span className='rounded-full bg-yellow-100 size-14 flex justify-center items-center'><Timer className='text-yellow-500'></Timer></span>
          </div>
          <div className=' w-full flex flex-col justify-center px-2'>
            <span className='text-sm font-medium text-gray-600'>Duracion promedio</span>
            <h1 className='font-bold text-xl'>{minProm}</h1>
            <span className='text-sm font-medium text-gray-600'>Minutos</span>
          </div>
        </div>
        <div className='border rounded-lg border-gray-300 shadow-xs flex px-3 hover:scale-102 transition-all duration-500'>
          <div className=' w-[25%] flex justify-center items-center'>
            <span className='rounded-full bg-purple-100 size-14 flex justify-center items-center'><DollarSign className='text-purple-500'></DollarSign></span>
          </div>
          <div className=' w-full flex flex-col justify-center px-2'>
            <span className='text-sm font-medium text-gray-600'>Precio promedio</span>
            <h1 className='font-bold text-xl'>${promPrice.toLocaleString('es-CO')}</h1>
            <span className='text-sm font-medium text-gray-600'>COP</span>
          </div>
        </div>
      </div>
      <div className=' px-3 flex justify-between'>
        <h1 className='font-bold'>Lista de servicios</h1>
        <div className=' flex gap-2'>
          <p className='font-medium text-gray-500' >Filtrar por estado</p>
          <select name="" id="" className='border rounded-lg text-gray-400'>
            <option value="">Todos</option>
            <option value="">Activos</option>
            <option value="">No Activos</option>
          </select>
        </div>
      </div>
      <div className=' h-100 grid grid-cols-3 grid-rows-2 gap-3 px-3'>
        {
          allServices.map(serv => (
            <div key={serv.id} className='border rounded-xl border-gray-400 shadow-2xs'>
              <div className=' h-[50%] flex'>
                <div className=' w-30 flex justify-center items-center'>
                  <span className='bg-green-100 text-green-500 size-15 flex justify-center items-center rounded-lg'><BriefcaseMedical></BriefcaseMedical></span>
                </div>
                <div className=' w-80 flex flex-col justify-center px-3'>
                  <h1 className='font-bold text-xl'>{serv.name}</h1>
                  <p className='font-medium text-sm text-gray-400'>{serv.description}</p>
                </div>
              </div>
              <div className='border-t h-[50%] border-gray-300'>
                <div className='h-5 flex gap-3 px-3 items-center'>
                  <span className='flex text-gray-300 font-medium text-sm'><Timer className='size-5'></Timer> {serv.duration_minutes} min</span>
                  <span className='flex text-gray-300 font-medium text-sm'>{serv.buffer_time_minutes} buffer</span>
                </div>
                <div className='h-8 flex justify-between items-center px-3'>
                  <span className='font-bold text-blue-500'>${serv.price.toLocaleString('es-CO')} COP</span>
                  <span className={` px-1 rounded-2xl font-bold ${serv.active?'text-green-700 bg-green-100':'text-gray-700 bg-gray-100'}`}>{serv.active?'Activo':'Inactivo'}</span>
                </div>
                <div className='h-10 flex justify-between items-center px-3'>
                  <button className='border flex gap-2 justify-center items-center px-2 py-1 text-gray-500 font-medium rounded-lg cursor-pointer hover:scale-105 transition-all duration-500'><Edit2Icon className='size-4'></Edit2Icon> Editar</button>
                  <button className='border flex gap-2 justify-center items-center px-2 py-1 text-gray-500 font-medium rounded-lg cursor-pointer hover:scale-105 transition-all duration-500'><Calendar className='size-4'></Calendar> Crear cita</button>
                  <button className='border flex gap-2 justify-center items-center px-2 py-1 text-red-500 font-medium rounded-lg cursor-pointer hover:scale-105 transition-all duration-500'><Trash></Trash></button>
                </div>
              </div>

            </div>
          ))
        }

      </div>
    </div>
  )
}
