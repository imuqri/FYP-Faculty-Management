// App.js

import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "antd";
import Login from "./pages/Login";
import { AuthContextProvider, UserAuth } from "./context/AuthContext";

import Sidebar from "./components/layouts/Sidebar";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";

import Main from "./pages/Main";
import UsersPage from "./pages/UsersPage";
import SoftwaresPage from "./pages/SoftwaresPage";
import EquipmentsPage from "./pages/EquipmentsPage";
import Account from "./components/Account";

const { Sider } = Layout;

function App() {
  const { user } = UserAuth();

  // Render the Sidebar and Routes only if the user is authenticated
  const renderContent = () => {
    if (user) {
      return (
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            width={200}
            theme="dark"
            style={{ position: "fixed", height: "100vh" }}
          >
            {/* Sidebar component */}
            <Sidebar />
          </Sider>
          <Layout className="site-layout" style={{ marginLeft: 200 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/main" />} />
              <Route path="/main" element={<Main />} />
              <Route path="/addUser" element={<UsersPage />} />
              <Route path="/addSoftware" element={<SoftwaresPage />} />
              <Route path="/addEquipment" element={<EquipmentsPage />} />
              <Route path="/account" element={<Account />} />
            </Routes>
            <Footer />
          </Layout>
        </Layout>
      );
    } else {
      return (
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      );
    }
  };

  return (
    <div>
      <AuthContextProvider>{renderContent()}</AuthContextProvider>
    </div>
  );
}

export default App;
