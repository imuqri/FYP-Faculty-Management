import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate} from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const {login} = UserAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    try {
      await login(email, password)
      navigate('/account')
    } catch (e) {
      setError(e.message)
      console.log(e.message)
    }
  }

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email Address</label>
          <input onChange={(e) => setEmail(e.target.value)} type="email"/>
        </div>
        <div>
          <label>Password</label>
          <input onChange={(e) => setPassword(e.target.value)} type="password"/>
        </div>
        <button>Log In</button>
      </form>
      <p>add user Comp <Link to='/adduser'>Add User</Link></p>
    </div>
  )
}

export default Login