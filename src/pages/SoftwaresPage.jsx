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
    <Container className="mt-3">
      <h1 className="text-center mb-3">MANAGE SOFTWARES</h1>
      <Card>
        <Card.Header className="d-flex justify-content-between">
          <h3>SOFTWARES</h3>
          <Button
            variant="success"
            style={{ width: "40px" }}
            onClick={toggleModal}
          >
            +
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
