// App.js

import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Layout, theme } from "antd";
import Login from "./pages/Login";
import { AuthContextProvider, UserAuth } from "./context/AuthContext";
import Sidebar from "./components/layouts/Sidebar";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import AppRoutes from "./routes/AppRoutes";

import Main from "./pages/Main";
import UsersPage from "./pages/UsersPage";
import SoftwaresPage from "./pages/SoftwaresPage";
import EquipmentsPage from "./pages/EquipmentsPage";
import Account from "./components/Account";

import { BrowserRouter as Router } from "react-router-dom";

const { Sider, Content } = Layout;

function App() {
  const { user } = UserAuth(); //check auth user

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const isMobile = window.innerWidth <= 768;
  const collapsedWidth = isMobile ? 0 : 60;
  const sidebarMaxWidth = isMobile ? 75 : 200;

  return (
    <AuthContextProvider>
      <Layout style={{ minHeight: "100vh" }}>
        {user ? (
          <>
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              collapsedWidth={collapsedWidth}
              width={sidebarMaxWidth}
            >
              <Sidebar collapsed={collapsed} />
            </Sider>
            <Layout>
              <Header collapsed={collapsed} setCollapsed={setCollapsed} />
              <Content
                style={{
                  margin: "24px 16px",
                  padding: 24,
                  minHeight: 280,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <AppRoutes />
              </Content>
              <Footer />
            </Layout>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        )}
      </Layout>
    </AuthContextProvider>
  );
}

export default App;
