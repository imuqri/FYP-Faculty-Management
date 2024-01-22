import React, { useState } from "react";
import { Container, Button, Modal, Row, Col } from "react-bootstrap";
import ManageClass from "../components/ManageClass";
import AddClass from "../components/AddClass";

const ManageLabsPage = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container className="mt-3">
      <h1 className="text-center mb-3">MANAGE CLASS</h1>

      <Row>
        <Col xs={12} md={6} className="text-md-right">
          <Button variant="primary" onClick={handleShow}>
            Add Labs
          </Button>
        </Col>
      </Row>
      <Row>
        <ManageClass />
      </Row>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <AddClass />s
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ManageLabsPage;
