import {  Scissors, User } from "lucide-react";

export default function FormAppointment() {
  return (
    <div className="w-full h-full m-1 px-4 flex flex-col gap-1">
      <div className=" w-full h-[10%] flex flex-col justify-center px-2">
        <h1 className="font-bold text-2xl">📅 Crear nueva cita</h1>
        <p className="font-semibold text-sm text-gray-400">Completa los datos para agendar una cita</p>
      </div>
      <div className=" h-[88%] flex gap-2">
        <div className="border w-[70%] bg-white border-gray-200 rounded-lg shadow-lg mb-2 py-5 px-6">
          <form action="" className=" w-full h-full flex flex-col gap-2">
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
              <input type="text" className="border px-2 py-1 rounded-lg  border-gray-300 text-gray-300" placeholder="Seleccione un servicio" />
            </section>

          </form>
        </div>
        <div className=" w-[30%] flex flex-col gap-2">
          <div className="border h-[60%] border-gray-200 rounded-lg shadow-lg">seccion2</div>
          <div className="border h-[29%] border-gray-200 rounded-lg bg-blue-50">seccion3</div>
        </div>
      </div>
    </div>
  )
}
//terminar maqueta del form (aun no tiene funcion ni conexion con backend)
//agregar icons a sidebar