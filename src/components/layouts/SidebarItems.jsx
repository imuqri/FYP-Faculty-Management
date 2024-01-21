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
    path: "/home",
  },
  {
    key: "addUser",
    icon: <UserAddOutlined />,
    label: "USERS",
    path: "/add-user",
  },
  {
    key: "addSoftware",
    icon: <AppstoreAddOutlined />,
    label: "SOFTWARES",
    path: "/add-software",
  },
  {
    key: "addEquipment",
    icon: <DesktopOutlined />,
    label: "EQUIPMENTS",
    path: "/add-equipment",
  },
  {
    key: "account",
    icon: <UserOutlined />,
    label: "ACCOUNT",
    path: "/account",
  },
  {
    key: "myReport",
    icon: <BookOutlined />,
    label: "MY REPORT",
    path: "/my-report",
  },
  {
    key: "displayFacility",
    icon: <BsBuildings />,
    label: "FACILITIES",
    path: "/facilities",
  },
  {
    key: "manageLabs",
    icon: <ImLab/>,
    label: "MANAGE LABS",
    path: "/manage-labs",
  },
  {
    key: "manageClasses",
    icon: <BiChalkboard />,
    label: "MANAGE CLASSES",
    path: "/manage-classes",
  },
];


export default sidebarItems;
