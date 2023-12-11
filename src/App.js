// App.jsx

import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "antd";
import Login from "./pages/Login";
import AddUser from "./components/AddUser";
import { AuthContextProvider, UserAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Main from "./pages/Main";
import Sidebar from "./components/Sidebar";

const { Content, Sider } = Layout;

function App() {
  const { user } = UserAuth();

  // Render the Sidebar and Routes only if the user is authenticated
  const renderContent = () => {
    if (user) {
      return (
        <Layout style={{ minHeight: "100vh" }}>
          <Sider width={80} theme="dark">
            <Sidebar />
          </Sider>
          <Layout className="site-layout">
            <Content style={{ margin: "16px", padding: 24, minHeight: 360 }}>
              {/* Render your component based on the route */}
              <Routes>
                <Route path="/" element={<Navigate to="/main" />} />
                <Route path="/addUser" element={<AddUser />} />
                <Route path="/main" element={<Main />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      );
    } else {
      return (
        // Render the Login page if the user is not authenticated
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
