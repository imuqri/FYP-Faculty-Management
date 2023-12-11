import React, { useState } from "react";
import { Container, Button, Card, Modal } from "react-bootstrap";
import SoftwareList from "../components/SoftwareList";
import AddSoftware from "../components/AddSoftware";

const Softwares = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header className="d-flex justify-content-end">
          <Button variant="primary" onClick={toggleModal}>
            Add Software
          </Button>
        </Card.Header>
        <Card.Body>
          <SoftwareList />
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Software</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddSoftware onClose={toggleModal} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Softwares;
