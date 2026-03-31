import { useAuth } from '../context/AuthContext'

export default function Login() {
    const {handleChangeInputLogin,handleSubmitLogin,userLogin,logout}=useAuth()
  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      <h1>login</h1>
      <form action=""onSubmit={handleSubmitLogin}>
        <input onChange={handleChangeInputLogin} type="text" placeholder='Enter your username' name='email' value={userLogin.email}/>
        <input onChange={handleChangeInputLogin} type="text" placeholder='Enter your password' name='password_hash' value={userLogin.password_hash}/>
        <button>Login</button>
      </form>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
