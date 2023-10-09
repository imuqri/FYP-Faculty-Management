import React from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Account = () => {

  const{user, logout} = UserAuth()
  const navigate = useNavigate() 

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
      console.log('logged out')
    } catch (e) {
      console.log(e.message)
    }
  }

  return (
    <div>
      <h1>account</h1>
      <p>User Email:{user && user.email}</p>
      <p>User Role:</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Account