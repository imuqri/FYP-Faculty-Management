import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Main";
import AddUser from "../pages/UsersPage";
import AddSoftware from "../pages/SoftwaresPage";
import AddEquipment from "../pages/EquipmentsPage";
import Account from "../components/Account";
import { UserAuth } from "../context/AuthContext";
import Login from "../pages/Login";
import UserReport from "../pages/MyReportsPage";
import DisplayFacility from "../pages/FacilitiesPage";
import ManageLab from "../pages/ManageLabsPage";
import ManageClass from "../pages/ManageClassesPage";

const AppRoutes = () => {
  const { user } = UserAuth();

  return (
    <Routes>
      {user ? (
        <Route path="/" element={<Navigate to="/" />} />
      ) : (
        <Route path="/" element={<Login />} />
      )}
      <Route path="/Home" element={<Home />} />
      <Route path="/Users" element={<AddUser />} />
      <Route path="/Softwares" element={<AddSoftware />} />
      <Route path="/Equipments" element={<AddEquipment />} />
      <Route path="/Account" element={<Account />} />
      <Route path="/My-report" element={<UserReport />} />
      <Route path="/Facilities" element={<DisplayFacility />} />
      <Route path="/Manage-labs" element={<ManageLab />} />
      <Route path="/Manage-classes" element={<ManageClass />} />
    </Routes>
  );
};

export default AppRoutes;
