import { useAuth } from '../context/AuthContext'

export default function Login() {
    const objectsContext=useAuth()
    console.log(objectsContext)
  return (
    <div>Login</div>
  )
}
