import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { Card, Form, Button } from "react-bootstrap";

const AddUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("User"); // Default role is 'user'

  const { createUser } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUser(email, password, role);
    } catch (e) {
      setError(e.message);
      console.log(e.message);
    }
  };

  return (
    <div className="container mt-1">
      <Card>
        <Card.Body>
          <Card.Title as="h2">Add User</Card.Title>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formRole" className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              >
                <option value="User">User</option>
                <option value="Technician">Technician</option>
                <option value="Technician Admin">Technician Admin</option>
                <option value="Class Admin">Class Admin</option>
                <option value="Lab Admin">Lab Admin</option>
                <option value="Super Admin">Super Admin</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Add User
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddUser;
