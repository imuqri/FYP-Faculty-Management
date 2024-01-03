import React, { useState } from "react";
import { Container, Button, Modal } from "react-bootstrap";
import UserList from "../components/UserList";
import AddUser from "../components/AddUser";

const Users = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <Container className="mt-5">
      <Button variant="primary" onClick={toggleModal}>
        Add User
      </Button>

      <UserList />

      <Modal show={showModal} onHide={toggleModal}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <AddUser onClose={toggleModal} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Users;
