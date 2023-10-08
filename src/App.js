import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from './components/Login';
import AddUser from './components/AddUser';
import Account from './components/Account';


function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/addUser' element={<AddUser/>}/>
        <Route path='/account' element={<Account/>}/>
      </Routes>
    </div>
  );
}

export default App;
