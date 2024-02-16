import React, { useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";

const Header = ({ collapsed, setCollapsed }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { user, logout } = UserAuth();
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      // Add logout functionality here
      console.log("Logout clicked");
    }
    // Add additional menu options and handling as needed
    setDropdownVisible(false); // Hide the dropdown after clicking an option
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      console.log("logged out");
    } catch (e) {
      console.log(e.message);
    }
  };

  const accountMenu = (
    <Menu onClick={handleMenuClick} style={{ minWidth: "150px" }}>
      <Menu.Item key="account" icon={<UserOutlined />}>
        <Link to="/Account"></Link>
        My Account
      </Menu.Item>
      <Menu.Item key="myreport" icon={<FileTextOutlined />}>
        <Link to="/My-report"></Link>
        My Reports
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#312466",
        boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
        padding: "0 16px",
        position: "fixed",
        width: "100%",
        zIndex: "100",
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
          color: "white",
        }}
      />

      <Dropdown
        overlay={accountMenu}
        placement="bottomRight"
        visible={dropdownVisible}
        onVisibleChange={(visible) => setDropdownVisible(visible)}
      >
        <Button
          type="text"
          icon={<UserOutlined />}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
            color: "white",
          }}
        />
      </Dropdown>
    </div>
  );
};

export default Header;
