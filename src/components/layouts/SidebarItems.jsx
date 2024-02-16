import React from "react";
import {
  UserOutlined,
  DesktopOutlined,
  HomeOutlined,
  UserAddOutlined,
  AppstoreAddOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { BsBuildings } from "react-icons/bs";
import { ImLab } from "react-icons/im";
import { BiChalkboard } from "react-icons/bi";

const sidebarItems = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: "HOME",
    path: "/Home",
    roles: ["Super Admin", "Lab Admin", "Class Admin", "Technician", "User"],
  },
  {
    key: "addUser",
    icon: <UserAddOutlined />,
    label: "USERS",
    path: "/Users",
    roles: ["Super Admin"],
  },
  {
    key: "addSoftware",
    icon: <AppstoreAddOutlined />,
    label: "SOFTWARES",
    path: "/Softwares",
    roles: ["Super Admin", "Lab Admin", "Class Admin", "Technician"],
  },
  {
    key: "addEquipment",
    icon: <DesktopOutlined />,
    label: "EQUIPMENTS",
    path: "/Equipments",
    roles: ["Super Admin", "Lab Admin", "Class Admin", "Technician"],
  },
  {
    key: "displayFacility",
    icon: <BsBuildings />,
    label: "FACILITIES",
    path: "/Facilities",
    roles: ["Super Admin", "Lab Admin", "Class Admin", "Technician", "User"],
  },
  {
    key: "manageLabs",
    icon: <ImLab />,
    label: "MANAGE LABS",
    path: "/Manage-labs",
    roles: ["Super Admin", "Lab Admin"],
  },
  {
    key: "manageClasses",
    icon: <BiChalkboard />,
    label: "MANAGE CLASSES",
    path: "/Manage-classes",
    roles: ["Super Admin", "Class Admin"],
  },
  {
    key: "myReport",
    icon: <BookOutlined />,
    label: "MY REPORTS",
    path: "/My-report",
    roles: ["Super Admin", "Lab Admin", "Class Admin", "Technician", "User"],
  },
  {
    key: "allReport",
    icon: <BookOutlined />,
    label: "FACILITIES REPORTS",
    path: "/Facilities-report",
    roles: ["SuperAdmin", "Technician"],
  },
  {
    key: "account",
    icon: <UserOutlined />,
    label: "ACCOUNT",
    path: "/Account",
    roles: ["Super Admin", "Lab Admin", "Class Admin", "Technician", "User"],
  },
];

export default sidebarItems;
