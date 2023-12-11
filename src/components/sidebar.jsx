// Sidebar.jsx

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu as AntMenu } from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  AppstoreAddOutlined,
  DesktopOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { label: "Home", icon: <HomeOutlined />, path: "/main" },
    { label: "Add User", icon: <TeamOutlined />, path: "/addUser" },
    {
      label: "Add Software",
      icon: <AppstoreAddOutlined />,
      path: "/addSoftware",
    },
    {
      label: "Add Equipment",
      icon: <DesktopOutlined />,
      path: "/addEquipment",
    },
    { label: "Account", icon: <UserOutlined />, path: "/account" },
  ];

  return (
    <Sider
      width={200} // Adjust the width as needed
      theme="dark"
      breakpoint="md"
      collapsedWidth="0"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          height: "64px", // Adjusted height
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "1.8em", // Adjusted font size
        }}
      >
        Logo
      </div>
      <AntMenu
        mode="vertical"
        theme="dark"
        selectedKeys={[location.pathname]}
        style={{ borderRight: 0 }}
      >
        {menuItems.map((item) => (
          <AntMenu.Item
            key={item.path}
            icon={item.icon}
            style={{
              padding: "16px", // Adjusted padding
              fontSize: "1.2em", // Adjusted font size
              display: "flex",
              alignItems: "center",
            }}
          >
            <Link
              to={item.path}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {item.label}
            </Link>
          </AntMenu.Item>
        ))}
      </AntMenu>
    </Sider>
  );
};

export default Sidebar;
