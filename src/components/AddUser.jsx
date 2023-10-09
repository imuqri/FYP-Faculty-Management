import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

const AddUser = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [role, setRole] = useState('User');  // Default role is 'user'
  
  const { createUser } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try{
      await createUser(email, password, role)
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
          <input onChange={(e) =>setPassword(e.target.value)} type="password"/>
        </div>
        <div>
          <label>Role</label>
          <select onChange={(e) => setRole(e.target.value)} value={role}>
            <option value="User">User</option> 
            <option value="Technician">Technician</option>
            <option value="Technician Admin">Technician Admin</option>
            <option value="Class Admin">Class Admin</option>
            <option value="Lab Admin">Lab Admin</option>
            <option value="Super Admin">Super Admin</option>
            
          </select>
        </div>
        <button>Add User</button>
      </form>
      <p>Log in Component <Link to='/'>Log In</Link></p>
    </div>
  )
}

export default AddUser