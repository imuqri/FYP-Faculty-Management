// App.js

import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "antd";
import Login from "./pages/Login";
import AddUser from "./components/AddUser";
import { AuthContextProvider, UserAuth } from "./context/AuthContext";
import Main from "./pages/Main";
import Sidebar from "./components/layouts/Sidebar";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";

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
            <Header />
            <Routes>
              <Route path="/" element={<Navigate to="/main" />} />
              <Route path="/addUser" element={<AddUser />} />
              <Route path="/main" element={<Main />} />
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
