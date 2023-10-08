import React from 'react'
import { Link } from 'react-router-dom'

const AddUser = () => {
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
        <button>Add User</button>
      </form>
      <p>Log in Comp <Link to='/'>Add User</Link></p>
    </div>
  )
}

export default AddUser