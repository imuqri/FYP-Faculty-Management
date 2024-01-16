// App.js

import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Layout, theme } from "antd";
import { AuthContextProvider, UserAuth } from "./context/AuthContext";
import Sidebar from "./components/layouts/Sidebar";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import AppRoutes from "./routes/AppRoutes";

import Login from "./pages/Login";
import Main from "./pages/Main";

const { Sider, Content } = Layout;

function App() {
  const { user } = UserAuth(); // check auth user

  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const isMobile = window.innerWidth <= 768;
  const collapsedWidth = isMobile ? 0 : 60;
  const sidebarMaxWidth = isMobile ? 170 : 200;

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
              style={{
                position: "fixed", // Set sidebar to have a fixed position
                height: "100%", // Make sidebar take the full height of the viewport
                zIndex: 1, // Make sidebar appear above content
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Sidebar collapsed={collapsed} />
            </Sider>
            <Layout>
              <Header collapsed={collapsed} setCollapsed={setCollapsed} />
              <Content
                style={{
                  marginTop: 80,
                  margin: "80px auto", // Center the content vertically
                  maxWidth: 1400, // Set the maximum width
                  width: "100%",
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
