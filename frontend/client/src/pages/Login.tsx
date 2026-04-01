import { useAuth } from '../context/AuthContext'

export default function Login() {
    const {handleChangeInputLogin,handleSubmitLogin,userLogin}=useAuth()
  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      <h1>login</h1>
      <form action=""onSubmit={handleSubmitLogin} className='border p-5 flex flex-col justify-between rounded-lg shadow-lg gap-2 w-[20%] h-[20%]'>
        <input onChange={handleChangeInputLogin} type="text" placeholder='Enter your username' name='email' value={userLogin.email} className='px-1 py-0.5 border rounded-lg'/>
        <input onChange={handleChangeInputLogin} type="text" placeholder='Enter your password' name='password_hash' value={userLogin.password_hash} className='px-1 py-0.5 border rounded-lg'/>
        <button className='p-2 rounded-lg font-bold bg-sky-400'>Login</button>
      </form>
      
    </div>
  )
}
