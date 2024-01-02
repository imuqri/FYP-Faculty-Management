import React from "react";
import {
  UserOutlined,
  DesktopOutlined,
  HomeOutlined,
  UserAddOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";

const sidebarItems = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: "HOME",
    path: "/home",
  },
  {
    key: "addUser",
    icon: <UserAddOutlined />,
    label: "USERS",
    path: "/addUser",
  },
  {
    key: "addSoftware",
    icon: <AppstoreAddOutlined />,
    label: "SOFTWARES",
    path: "/addSoftware",
  },
  {
    key: "addEquipment",
    icon: <DesktopOutlined />,
    label: "EQUIPMENTS",
    path: "/addEquipment",
  },
  {
    key: "account",
    icon: <UserOutlined />,
    label: "ACCOUNT",
    path: "/account",
  },
];

export default sidebarItems;
