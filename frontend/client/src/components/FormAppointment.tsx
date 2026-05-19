import { Calendar, Lightbulb, MessageCircleCheck, Notebook, Scissors, Timer, User } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

//el objeto se puede enviar sin client_id,
//la idea es crear un select/buscador que me permita seleccionar un cliente en caso de que asi sea
//crear vista donde el profesional pueda ver sus servicios, y boton para dirigir al form y crear servicio


export type ServicesProps = {
  id: number
  profesional_id: number
  name: string,
  description: string,
  price: number,
  duration_minutes?: number
  buffer_time_minutes: number,
  active: boolean
  created_at: string
}
export type AppointmentsProps = {
  client_id?: number|null 
  service_id: number
  start_datetime: string
  end_datetime: string,
  status: "confirmed" | "available" | "canceled" | "completed" | "pending"
  notes?: string
}

export default function FormAppointment() {
  const [allServices, setAllServices] = useState<ServicesProps[]>([])
  const [appointmentToSend, setAppointmentToSend] = useState<AppointmentsProps>({ service_id: 0, start_datetime: '', end_datetime: '', status: "available" })
  const [durationAppointment, setDurationAppointment] = useState(0)
  const getAllServices = async () => {
    const result = await fetch('http://localhost:5000/services/me', {
      method: 'GET',
      credentials: 'include'
    })
    const data = await result.json()
    setAllServices(data.servicios)

  }
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target.name === 'service_id') {
      const select = e.target as HTMLSelectElement;
      const selectedOption = select.selectedOptions[0];
      const duration = selectedOption.getAttribute("data-duration");
      setDurationAppointment(Number(duration))
    }
    setAppointmentToSend(prev => ({ ...prev, [e.target.name]: e.target.value }))

  }
  const clearForm=()=>{
    setAppointmentToSend({ service_id: 0, start_datetime: '', end_datetime: '', status: "available",client_id:null })
    setDurationAppointment(0)
  }
  const formatLocalDateTime = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!appointmentToSend.service_id || !appointmentToSend.start_datetime || !appointmentToSend.end_datetime) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Debe llenar todos los campos obligatorios del formulario.',
        showConfirmButton: false,
        timer: 2000
      })
      return
    }
    const result = await fetch('http://localhost:5000/appointments/slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(appointmentToSend)
    })
    const data = await result.json()
    if (!result.ok) {
      Swal.fire({
        icon: 'error',
        title: 'Error a crear cita!',
        text: data.message,
        showConfirmButton: false,
        timer: 2000
      })
      return
    }
    Swal.fire({
      icon: 'success',
      title: 'Todo salió bien!',
      text: data.message,
      showConfirmButton: false,
      timer: 2000
    })
    setAppointmentToSend({ service_id: 0, start_datetime: '', end_datetime: '', status: "available",client_id:null })
  }
  useEffect(() => {
    getAllServices()
  }, [])
  useEffect(() => {
    if (appointmentToSend.start_datetime && durationAppointment) {
      const start = new Date(appointmentToSend.start_datetime);

      if (isNaN(start.getTime())) return;

      start.setMinutes(start.getMinutes() + durationAppointment);

      setAppointmentToSend(prev => ({
        ...prev,
        end_datetime: formatLocalDateTime(start)
      }));
    } else {
      setAppointmentToSend(prev => ({
        ...prev,
        end_datetime: ''
      }));
    }
  }, [appointmentToSend.start_datetime, durationAppointment]);
  useEffect(()=>{
    console.log(appointmentToSend)
  },[appointmentToSend])

  return (
    <div className="w-full h-full m-1 px-4 flex flex-col gap-1">
      <div className=" w-full h-[10%] flex flex-col justify-center px-2">
        <h1 className="font-bold text-2xl">📅 Crear nueva cita</h1>
        <p className="font-semibold text-sm text-gray-400">Completa los datos para agendar una cita</p>
      </div>
      <div className=" h-[88%] flex gap-2">
        <div className="border w-[70%] bg-white border-gray-200 rounded-lg shadow-lg mb-2 py-5 px-6">
          <form action="" onSubmit={handleSubmitForm} className=" w-full h-full flex flex-col gap-2">
            <div className=" flex gap-2 px-1 items-center">
              <User className="size-8 bg-blue-500 text-white p-1.5 rounded-full"></User>
              <p className="font-bold">Cliente</p>
            </div>
            <section className=" flex flex-col gap-0.5">
              <label htmlFor="" className="font-semibold text-sm">Seleccione Cliente</label>
              <input type="text" className="border px-2 py-1 rounded-lg  border-gray-300 text-gray-300" placeholder="Buscar por nombre o usuario" />
            </section>
            <div className=" flex gap-2 px-1 items-center">
              <Scissors className="size-8 bg-blue-500 text-white p-1.5 rounded-full"></Scissors>
              <p className="font-bold">Servicio</p>
            </div>
            <section className=" flex flex-col gap-0.5">
              <label htmlFor="" className="font-semibold text-sm">Seleccione Servicio</label>
              <select onChange={handleChangeInput} name="service_id" id="" value={appointmentToSend.service_id} className="border px-2 py-1 rounded-lg  border-gray-300 text-gray-300">
                <option value={Number(0)}>Seleccione Servicio</option>
                {
                  allServices.map(serv => (
                    <option value={serv.id} data-duration={serv.duration_minutes} key={serv.id}>{serv.name}</option>
                  ))
                }
              </select>
            </section>
            <section className=" w-full h-40 flex gap-2">
              <div className=" w-full flex flex-col gap-2">
                <div className="gap-2 flex flex-col">
                  <div className="flex gap-1">
                    <Calendar className="size-8 bg-blue-500 text-white p-1.5 rounded-full"></Calendar> <label htmlFor="" className="font-bold">Fecha Inicio</label>
                  </div>
                  <input onChange={handleChangeInput} value={appointmentToSend.start_datetime} type="datetime-local" name="start_datetime" className="border w-full rounded-lg px-2 py-1 text-gray-400" />
                </div>
                <div className="gap-2 flex flex-col">
                  <div className="flex gap-1">
                    <Timer></Timer> <label htmlFor="" className="font-bold">Fecha Final</label>
                  </div>
                  <input value={appointmentToSend.end_datetime ? new Date(appointmentToSend.end_datetime).toLocaleString('es-CO') : "Se calcula automaticamente"} type="text" className="border w-full rounded-lg px-2 py-1 text-gray-400 bg-gray-200" readOnly />
                </div>

              </div>
              <div className=" w-full">
                <div className="gap-2 flex flex-col">
                  <div className="flex gap-1">
                    <Timer className="size-8 bg-blue-500 text-white p-1.5 rounded-full"></Timer> <label htmlFor="" className="font-bold">Duracion</label>
                  </div>
                  <input readOnly type="text" className="border w-full rounded-lg px-2 py-1 text-gray-400" value={durationAppointment ? `${durationAppointment} minutos` : 'Seleccione servicio'} />
                </div>
              </div>
            </section>
            <section className="flex flex-col gap-2 h-30 ">
              <div className="flex gap-1">
                <Notebook></Notebook><p className="font-bold">Notas(opcional) </p>
              </div>
              <textarea name="notes" id="" onChange={handleChangeInput} className="border w-full h-full rounded-lg border-gray-400 px-2 py-1" placeholder="Agrega algun detalle adicional...">

              </textarea>
            </section>
            <div className=" flex gap-1">
              <button type="button" onClick={clearForm} className="px-2 py-1 w-full rounded-lg bg-gray-300 font-bold cursor-pointer">Cancelar</button>
              <button type="submit" className=" px-2 py-1 w-full rounded-lg bg-blue-500 font-bold cursor-pointer text-white">Crear Cita</button>
            </div>

          </form>
        </div>
        <div className=" w-[30%] flex flex-col gap-2">
          <div className="border h-[60%] border-gray-200 rounded-lg shadow-lg gap-2">
            <div className="bg-blue-50 h-[12%] flex justify-center items-center gap-1 rounded-t-lg">
              <Calendar className="text-blue-500"></Calendar><span className="font-bold text-xl">Resumen de cita</span>
            </div>
            <div className=" px-2 mt-2 flex gap-3">
              <span className="bg-blue-50 rounded-full size-12 flex items-center justify-center"><User className="size-5  text-blue-500"></User></span>
              <div className="flex flex-col border-b w-[80%] border-gray-300">
                <span className="font-bold">Cliente</span>
                <span>{appointmentToSend.client_id?appointmentToSend.client_id:'---'}</span>
              </div>
            </div>
            <div className=" px-2 mt-2 flex gap-3">
              <span className="bg-green-50 rounded-full size-12 flex items-center justify-center"><Scissors className="size-5  text-green-500"></Scissors></span>
              <div className="flex flex-col border-b w-[80%] border-gray-300">
                <span className="font-bold">Servicio</span>
                <span>{allServices.find(service => Number(service.id) === Number(appointmentToSend.service_id))?.name || '---'}</span>
              </div>
            </div>
            <div className=" px-2 mt-2 flex gap-3">
              <span className="bg-purple-50 rounded-full size-12 flex items-center justify-center"><Calendar className="size-5  text-purple-500"></Calendar></span>
              
              <div className="flex flex-col border-b w-[80%] border-gray-300">
                <span className="font-bold">Fecha y hora</span>
                <span>{appointmentToSend.start_datetime?new Date(appointmentToSend.start_datetime).toLocaleString('es-CO',{
                  day:'2-digit',
                  month:'long',
                  year:'numeric',
                  hour:'2-digit',
                  minute:'2-digit'
                }):'---'}</span>
              </div>
            </div>
            <div className=" px-2 mt-2 flex gap-3">
              <span className="bg-yellow-50 rounded-full size-12 flex items-center justify-center"><Notebook className="size-5  text-yellow-500"></Notebook></span>
              <div className="flex flex-col border-b w-[80%] border-gray-300">
                <span className="font-bold">Notas</span>
                <span>{appointmentToSend.notes||'---'}</span>
              </div>
            </div>
          </div>
          <div className="border h-[29%] border-gray-200 rounded-lg bg-blue-50 flex flex-col gap-2 py-4 px-3">
            <h1 className="flex gap-2"><Lightbulb className="text-yellow-300"></Lightbulb><span className="font-bold">Ten en cuenta</span></h1>
            <p className="flex gap-2"><MessageCircleCheck className="text-blue-300"></MessageCircleCheck><span className="font-light">Verifica que la fecha este disponible</span></p>
            <p className="flex gap-2"><MessageCircleCheck className="text-blue-300"></MessageCircleCheck><span className="font-light">La duracion se asigna segun el servicio</span></p>
            <p className="flex gap-2"><MessageCircleCheck className="text-blue-300"></MessageCircleCheck><span className="font-light">el cliente recibirá una notificacion</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
