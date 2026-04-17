import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"

type AppointmentsProps = {
    id: number
    service_name: string
    client_name: string
    start_datetime: string
    end_datetime: string
    status: string
    professional_id: number
}

export default function AgendaProfesional() {
    const [myAppointments, setMyAppointments] = useState<AppointmentsProps[]>([])
    const [loading, setLoading] = useState(true)

    const getAppointmentsProf = async () => {
        const result = await fetch('http://localhost:5000/professionals/me/appointments', {
            credentials: 'include',
            method: 'GET'
        })

        const data = await result.json()

        if (!result.ok) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR!',
                text: data.message
            })
            return
        }

        setMyAppointments(data)
        setLoading(false)
    }

    useEffect(() => {
        getAppointmentsProf()
    }, [])

    if (loading) return <p>Cargando citas...</p>


    return (
        <div className="w-full flex flex-col items-center gap-6 p-4">
            <Link to={'/dashboard-professional/form-appointment'}><button className="bg-blue-400 px-2 py-1 rounded-lg font-bold text-white cursor-pointer hover:scale-105 transition-all duration-500">Crear Agendas</button></Link>
            {
                myAppointments.length > 0 ?
                    myAppointments.map(item => (
                        <div className="w-[70%]">
                            <div className="bg-gray-300 font-bold text-slate-900 px-2 py-1 rounded-lg mb-1">
                                📅 {new Date(item.start_datetime).toLocaleString('es-CO', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="flex items-center shadow-md rounded-lg justify-between px-2 py-1 hover:shadow-lg">
                                <div>
                                    <p className="font-bold text-gray-600">{item.service_name}</p>
                                    <p className="font-light text-gray-400">{item.client_name || 'Sin usuario'}</p>
                                </div>
                                <span className="text-gray-400">
                                    {new Date(item.start_datetime).toLocaleString('es-CO', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}-{new Date(item.end_datetime).toLocaleString('es-CO', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                                <span className={`border p-1 rounded-xl font-bold ${item.status === 'pending' ? "bg-red-200 text-red-500" : item.status === 'available' ? "bg-green-200 text-green-500" : "bg-amber-200 text-amber-500"}`}>{item.status}</span>
                            </div>
                        </div>
                    ))
                    : <p className="bg-gray-300 px-2 py-1 rounded-lg font-bold text-2xl text-gray-600">No tiene citas registradas aun </p>
            }



        </div>
    )
}