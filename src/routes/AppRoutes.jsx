import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Main";
import AddUser from "../pages/UsersPage";
import AddSoftware from "../pages/SoftwaresPage";
import AddEquipment from "../pages/EquipmentsPage";
import Account from "../components/Account";
import { UserAuth } from "../context/AuthContext";
import Login from "../pages/Login";

const AppRoutes = () => {
  const { user } = UserAuth();

  return (
    <Routes>
      {user ? (
        <Route path="/" element={<Navigate to="/" />} />
      ) : (
        <Route path="/" element={<Login />} />
      )}
      <Route path="/home" element={<Home />} />
      <Route path="/addUser" element={<AddUser />} />
      <Route path="/addSoftware" element={<AddSoftware />} />
      <Route path="/addEquipment" element={<AddEquipment />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  );
};

export default AppRoutes;
