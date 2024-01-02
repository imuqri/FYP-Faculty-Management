import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import SidebarItems from "./SidebarItems";

const Sidebar = ({ collapsed }) => {
  return (
    <div style={{ padding: "2px", textAlign: "center", marginTop: "80px" }}>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["home"]}>
        {SidebarItems.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.path}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
};

export default Sidebar;
