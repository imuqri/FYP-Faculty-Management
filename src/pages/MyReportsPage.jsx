import React, { useState } from "react";
import { Container, Button, Card, Modal } from "react-bootstrap";
import UserReport from "../components/UserReport";
import AddReport from "../components/AddReport";

const Reports = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <Container className="mt-3">
      <Card>
        <Card.Header className="d-flex justify-content-between">
          <h3>MY REPORTS</h3>
          <Button
            variant="success"
           
            onClick={toggleModal}
          >
            Add Report
          </Button>
        </Card.Header>
        <Card.Body>
          <UserReport />
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddReport onClose={toggleModal} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Reports;
