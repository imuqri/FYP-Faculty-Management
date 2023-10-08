import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from './components/Login';
import AddUser from './components/AddUser';
import Account from './components/Account';
import { AuthContextProvider } from "./context/AuthContext";


function App() {
  return (
    <div>
      <AuthContextProvider>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/addUser' element={<AddUser/>}/>
          <Route path='/account' element={<Account/>}/>
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
