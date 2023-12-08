import React, { useState, useEffect } from "react";
import { ref, onValue, remove, update } from "firebase/database";
import { database } from "../firebase";
import { Button, Card, Nav, Tab, Form, Modal } from "react-bootstrap";
import { MdOutlineDeleteForever, MdOutlineEditNote } from "react-icons/md";

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [uniqueRoles, setUniqueRoles] = useState([]);
  const [activeRole, setActiveRole] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");

  useEffect(() => {
    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const userArray = Object.entries(userData).map(([id, data]) => ({
          id,
          ...data,
        }));

        // Sort the userList alphabetically based on the email field
        const sortedUserList = userArray.sort((a, b) =>
          a.email.localeCompare(b.email)
        );

        setUserList(sortedUserList);

        const roles = [...new Set(sortedUserList.map((user) => user.role))];
        setUniqueRoles(roles);
      }
    });
  }, []);

  const handleDeleteUser = (userId) => {
    const userRef = ref(database, `users/${userId}`);
    remove(userRef)
      .then(() => {
        console.log("User deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const handleShowEditModal = (user) => {
    setSelectedUser(user);
    setEditEmail(user.email);
    setEditRole(user.role);
    setShowEditModal(true);
  };

  const handleEditUser = () => {
    const { id } = selectedUser;
    const userRef = ref(database, `users/${id}`);
    update(userRef, { email: editEmail, role: editRole })
      .then(() => {
        console.log("User updated successfully.");
        setShowEditModal(false);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  return (
    <div className="container mt-5">
      <h2>User List</h2>
      <Tab.Container id="user-list-tabs" defaultActiveKey="All">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="All" onSelect={() => setActiveRole("All")}>
              All
            </Nav.Link>
          </Nav.Item>
          {[
            "User",
            "Technician",
            "Technician Admin",
            "Class Admin",
            "Lab Admin",
            "Super Admin",
          ].map((role) => (
            <Nav.Item key={role}>
              <Nav.Link eventKey={role} onSelect={() => setActiveRole(role)}>
                {role}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
        <Tab.Content>
          {[
            "All",
            "User",
            "Technician",
            "Technician Admin",
            "Class Admin",
            "Lab Admin",
            "Super Admin",
          ].map((role) => (
            <Tab.Pane key={role} eventKey={role}>
              <Card>
                <Card.Body>
                  {userList
                    .filter((user) => role === "All" || user.role === role)
                    .map((user) => (
                      <div
                        key={user.id}
                        className="d-flex justify-content-between align-items-center mb-2"
                      >
                        <div>{user.email}</div>
                        <div>
                          <Button
                            variant="primary"
                            className="me-2"
                            onClick={() => handleShowEditModal(user)}
                          >
                            <MdOutlineEditNote />
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <MdOutlineDeleteForever />
                          </Button>
                        </div>
                      </div>
                    ))}
                </Card.Body>
              </Card>
            </Tab.Pane>
          ))}
        </Tab.Content>
      </Tab.Container>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formEditEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEditRole">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
            >
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserList;
