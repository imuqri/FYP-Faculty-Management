import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';


const Login = () => {
  return (
    <div className='container'>
      <form>
        <div>
          <label>Email Address</label>
          <input type="email"/>
        </div>
        <div>
          <label>Password</label>
          <input type="password"/>
        </div>
        <button>Log In</button>
      </form>
      <p>add user Comp <Link to='/adduser'>Add User</Link></p>
    </div>
  )
}

export default Login