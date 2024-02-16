import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import SidebarItems from "./SidebarItems";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

const Sidebar = ({ collapsed }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);

        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            setUserRole(userData.role);
            console.log(userData.role);
          }
        });
      } else {
        setUserRole(null);
      }
    });
    
    return () => unsubscribe();
  }, []);

  const filteredSidebarItems = SidebarItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <div style={{ padding: "2px", textAlign: "center", marginTop: "80px" }}>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["home"]}>
        {filteredSidebarItems.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.path}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
};

export default Sidebar;
