import React, { useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const Header = ({ collapsed, setCollapsed }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      // Add logout functionality here
      console.log("Logout clicked");
    }
    // Add additional menu options and handling as needed
    setDropdownVisible(false); // Hide the dropdown after clicking an option
  };

  const accountMenu = (
    <Menu onClick={handleMenuClick} style={{ minWidth: "150px" }}>
      <Menu.Item key="account" icon={<UserOutlined />}>
        My Account
      </Menu.Item>
      <Menu.Item key="myreport" icon={<FileTextOutlined />}>
        My Report
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
      {/* Add more menu items as needed */}
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
        zIndex: "2",
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
