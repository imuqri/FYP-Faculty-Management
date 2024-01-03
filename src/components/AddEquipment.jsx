import React, { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from "../firebase";

import { Container, Card, Form, Button } from "react-bootstrap";

const AddEquipment = () => {
  const [equipmentName, setEquipmentName] = useState("");

  const handleAddEquipment = () => {
    if (equipmentName) {
      const equipmentRef = ref(database, "equipments"); // Reference to the "equipment" node
      push(equipmentRef, { name: equipmentName })
        .then(() => {
          console.log("Equipment added successfully.");
          setEquipmentName("");
        })
        .catch((error) => {
          console.error("Error adding equipment:", error);
        });
    } else {
      console.error("Please enter equipment name.");
    }
  };

  return (
    <Container className="mt-3 mb-3">
      <Card>
        <Card.Body className="d-flex flex-column">
          <Card.Title as="h2">Add Equipment</Card.Title>

          <Form.Group className="mb-3">
            <Form.Label>Equipment Name:</Form.Label>
            <Form.Control
              type="text"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="primary"
            onClick={handleAddEquipment}
            className="align-self-end"
          >
            Add Equipment
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddEquipment;
