import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Main";
import AddUser from "../pages/UsersPage";
import AddSoftware from "../pages/SoftwaresPage";
import AddEquipment from "../pages/EquipmentsPage";
import Account from "../components/Account";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/addUser" element={<AddUser />} />
      <Route path="/addSoftware" element={<AddSoftware />} />
      <Route path="/addEquipment" element={<AddEquipment />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  );
};

export default AppRoutes;
