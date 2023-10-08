import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

const AddUser = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const { createUser } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try{
      await createUser(email, password)
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
        <button>Add User</button>
      </form>
      <p>Log in Comp <Link to='/'>Log In</Link></p>
    </div>
  )
}

export default AddUser