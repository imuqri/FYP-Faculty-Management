import React, { useState } from "react";
import { Container, Button, Card, Modal } from "react-bootstrap";
import EquipmentList from "../components/EquipmentList";
import AddEquipment from "../components/AddEquipment";

const Equipments = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header className="d-flex justify-content-end">
          <Button variant="primary" onClick={toggleModal}>
            Add Equipment
          </Button>
        </Card.Header>
        <Card.Body>
          <EquipmentList />
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={toggleModal} centered>
        <AddEquipment onClose={toggleModal} />
      </Modal>
    </Container>
  );
};

export default Equipments;
