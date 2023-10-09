import { createContext, useContext, useEffect, useState} from 'react'
import {
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged
} from 'firebase/auth'
import { ref, set } from 'firebase/database'
import {auth, database} from '../firebase'

const UserContext = createContext()

export const AuthContextProvider = ({children}) => {

    const [user, setUser] = useState({})
    const [userRole, setUserRole] = useState({})

    const createUser = async (email, password, role) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user;

        // Store user details in the Realtime Database
        const userRef = ref(database, `users/${user.uid}`);
        set(userRef, {
            email: user.email,
            role: role,
        });

        return userCredential;

        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        } 
    }

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log(currentUser)
            setUser(currentUser)
        })
        return () => {
            unsubscribe();
        }
    }, [])

    return (
        <UserContext.Provider value={{createUser, user, logout, login}}>
            {children}
        </UserContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(UserContext)
}