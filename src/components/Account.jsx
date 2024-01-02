import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import { database } from "../firebase";
import { Card, Button } from "react-bootstrap";

const Account = () => {
  const { user, logout } = UserAuth();
  const [userRole, setUserRole] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user role when the component mounts
    const fetchUserRole = async () => {
      try {
        if (user && user.uid) {
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserRole(snapshot.val().role);
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [user]); // Fetch the user role whenever the user object changes

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      console.log("logged out");
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="container mt-5">
      <Card>
        <Card.Body>
          <Card.Title as="h2">Account</Card.Title>
          <Card.Text>
            <p>User Email: {user && user.email}</p>
            <p>User Role: {userRole}</p>
          </Card.Text>
          <Button variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Account;
