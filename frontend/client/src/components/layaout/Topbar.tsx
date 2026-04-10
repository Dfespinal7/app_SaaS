import { useAuth } from "../../context/AuthContext"

export type classNameProps={
    className?:string
    logout?:()=>void
}
export default function Topbar({className}:classNameProps) {
  const {userReturned,logout}=useAuth()
  return (
    <div className={className}>
      <div className="flex  gap-3 justify-center items-center">
        <div className=" rounded-full size-10 flex justify-center items-center bg-gray-200"><span className="font-bold text-gray-600">{userReturned?.name.charAt(0).toUpperCase()}</span></div>
      </div>
      <div className="flex-1  flex justify-between items-center px-5">
        <span className="font-semibold text-gray-500">{userReturned?.name}</span>
        <span className="font-semibold text-gray-500">{userReturned?.role}</span>
        <span className="font-semibold text-gray-500">App Saas</span>
      </div>
      <button onClick={logout} className='p-2 my-4 rounded-lg bg-red-500 font-bold text-white cursor-pointer hover:scale-105 transition-all duration-500'>logout</button>
    </div>
  )
}
