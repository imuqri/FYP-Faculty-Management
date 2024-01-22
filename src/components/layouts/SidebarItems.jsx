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
  },
  {
    key: "addUser",
    icon: <UserAddOutlined />,
    label: "USERS",
    path: "/Users",
  },
  {
    key: "addSoftware",
    icon: <AppstoreAddOutlined />,
    label: "SOFTWARES",
    path: "/Softwares",
  },
  {
    key: "addEquipment",
    icon: <DesktopOutlined />,
    label: "EQUIPMENTS",
    path: "/Equipments",
  },
  {
    key: "account",
    icon: <UserOutlined />,
    label: "ACCOUNT",
    path: "/Account",
  },
  {
    key: "myReport",
    icon: <BookOutlined />,
    label: "MY REPORT",
    path: "/My-report",
  },
  {
    key: "displayFacility",
    icon: <BsBuildings />,
    label: "FACILITIES",
    path: "/Facilities",
  },
  {
    key: "manageLabs",
    icon: <ImLab />,
    label: "MANAGE LABS",
    path: "/Manage-labs",
  },
  {
    key: "manageClasses",
    icon: <BiChalkboard />,
    label: "MANAGE CLASSES",
    path: "/Manage-classes",
  },
];

export default sidebarItems;
