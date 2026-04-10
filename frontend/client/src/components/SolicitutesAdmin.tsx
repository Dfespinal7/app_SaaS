import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

type RequestProps = {
    id: number
    user_id: number
    status: string
    notes: string | null
    created_at: string
}
type StatusProps = 'approved' | 'rejected'
export default function SolicitutesAdmin() {
    const [allRequest, setAllRequest] = useState<RequestProps[] | []>([])
    const getAllRequest = async () => {
        const query = await fetch('http://localhost:5000/professional/request', {
            method: 'GET',
            credentials: 'include'
        })
        const data = await query.json()
        setAllRequest(data)
    }
    const submitResponse = async (status: StatusProps, id: number) => {
        const questionTosend = await Swal.fire({
            icon: 'question',
            title: `Esta seguro de ${status === 'approved' ? 'aprobar' : 'negar'} esta solicitud?`,
            showCancelButton: true,
            cancelButtonText: 'Cerrar',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'blue',
            cancelButtonColor: 'red'
        })
        if (questionTosend.isConfirmed) {
            const result = await fetch(`http://localhost:5000/professional-request/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            const data = await result.json()
            if (!result.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error!',
                    text:data.message,
                    showConfirmButton:false,
                    timer:3000
                    
                })
                return
            }
            getAllRequest()
            Swal.fire({
                    icon: 'success',
                    title: 'Todo Salió bien!',
                    text:data.message,
                    showConfirmButton:false,
                    timer:3000
                    
                })
        }
    }
    useEffect(() => {
        getAllRequest()
    }, [])
    return (
        <div className=' w-full flex justify-center items-center'>
            <table className="w-[70%] border-collapse shadow-md rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white uppercase text-sm">
                    <tr>
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Usuario</th>
                        <th className="p-3 text-left">Estado</th>
                        <th className="p-3 text-left">Notas</th>
                        <th className="p-3 text-left">Fecha</th>
                        <th className="p-3 text-center">Acción</th>
                    </tr>
                </thead>

                <tbody className="text-sm text-gray-700">
                    {allRequest.map((r) => (
                        <tr
                            key={r.id}
                            className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                        >
                            <td className="p-3 font-medium">{r.id}</td>

                            <td className="p-3">{r.user_id}</td>

                            <td className="p-3">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-bold
              ${r.status === "approved"
                                            ? "bg-green-100 text-green-700"
                                            : r.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {r.status}
                                </span>
                            </td>

                            <td className="p-3">{r.notes || "Sin notas"}</td>

                            <td className="p-3">
                                {new Date(r.created_at).toLocaleString("es-CO", {
                                    timeZone: "America/Bogota",
                                })}
                            </td>

                            <td className="p-3 flex gap-2 justify-center">
                                <button onClick={() => submitResponse('approved', r.id)} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition cursor-pointer hover:scale-105 duration-500">
                                    Aprobar
                                </button>

                                <button onClick={() => submitResponse('rejected', r.id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition cursor-pointer hover:scale-105 duration-500">
                                    Negar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
