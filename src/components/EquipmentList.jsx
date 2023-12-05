import React, { useState, useEffect } from "react";
import { ref, onValue, remove, update } from "firebase/database";
import { database } from "../firebase";
import { Button, Modal, Form, ListGroup } from "react-bootstrap";
import { MdOutlineEditNote, MdOutlineDeleteForever } from "react-icons/md";

const EquipmentList = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEquipmentId, setEditEquipmentId] = useState("");
  const [editEquipmentName, setEditEquipmentName] = useState("");

  useEffect(() => {
    // Fetch equipment data from Firebase
    const equipmentRef = ref(database, "equipments");
    onValue(equipmentRef, (snapshot) => {
      if (snapshot.exists()) {
        const equipmentData = snapshot.val();
        const equipmentArray = Object.entries(equipmentData)
          .map(([id, data]) => ({ id, name: data.name }))
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort by equipment name
        setEquipmentList(equipmentArray);
      }
    });
  }, []);

  const handleShowEditModal = (id, name) => {
    setEditEquipmentId(id);
    setEditEquipmentName(name);
    setShowEditModal(true);
  };

  const handleEditEquipment = () => {
    const equipmentRef = ref(database, `equipments/${editEquipmentId}`);
    update(equipmentRef, { name: editEquipmentName })
      .then(() => {
        console.log("Equipment name updated successfully.");
        setShowEditModal(false);
      })
      .catch((error) => {
        console.error("Error updating equipment name:", error);
      });
  };

  const handleDeleteEquipment = (id) => {
    const equipmentRef = ref(database, `equipments/${id}`);
    remove(equipmentRef)
      .then(() => {
        console.log("Equipment deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting equipment:", error);
      });
  };

  return (
    <div className="container mt-5">
      <h2>Equipment List</h2>
      <ListGroup>
        {equipmentList.map((equipment) => (
          <ListGroup.Item
            key={equipment.id}
            className="d-flex justify-content-between align-items-center"
          >
            {equipment.name}
            <div>
              <Button
                variant="primary"
                className="me-2"
                onClick={() =>
                  handleShowEditModal(equipment.id, equipment.name)
                }
              >
                <MdOutlineEditNote />
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteEquipment(equipment.id)}
              >
                <MdOutlineDeleteForever />
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Edit Equipment Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Equipment Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Enter new equipment name"
            value={editEquipmentName}
            onChange={(e) => setEditEquipmentName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditEquipment}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EquipmentList;
