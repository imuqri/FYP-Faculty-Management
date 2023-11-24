import React, {useEffect, useState} from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ref, get } from 'firebase/database';
import { database } from '../firebase';

import AddSoftware from './AddSoftware';
import AddEquipment from './AddEquipment';

const Account = () => {

  const{user, logout} = UserAuth()
  const [userRole, setUserRole] = useState();
  const navigate = useNavigate() 

  useEffect(() => {
    // Fetch the user role when the component mounts
    const fetchUserRole = async () => {
      try {
        if (user && user.uid) {
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserRole(snapshot.val().role);
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, [user]); // Fetch the user role whenever the user object changes

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
      <div>
        <h1>account</h1>
        <p>User Email: {user && user.email}</p>
        <p>User Role: {userRole}</p>

        <button onClick={handleLogout}>Logout</button>
      </div>
      <AddSoftware/>
      <div/>
      <AddEquipment/>
      <div>

      </div>
    </div>
  )
}

export default Account