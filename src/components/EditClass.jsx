import React, { useState, useEffect } from "react";
import { getDatabase, ref as databaseRef, set, get } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";

const EditClass = ({ classData, show, handleClose }) => {
  const [className, setClassName] = useState("");
  const [classLocation, setClassLocation] = useState("");
  const [classCapacity, setClassCapacity] = useState(0);
  const [classImage, setClassImage] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [classEquipments, setClassEquipments] = useState([]);

  const storage = getStorage();
  const classRef = databaseRef(getDatabase(), "classes");
  const equipmentsRef = databaseRef(getDatabase(), "equipments");

  useEffect(() => {
    if (classData) {
      setClassName(classData.name || "");
      setClassLocation(classData.location || "");
      setClassCapacity(classData.capacity || 0);
      setClassEquipments(classData.equipments || []);
    }

    // Fetch equipment options from the database
    const fetchEquipments = async () => {
      try {
        const snapshot = await get(equipmentsRef);
        if (snapshot.exists()) {
          const equipmentData = snapshot.val();
          const equipmentList = Object.keys(equipmentData).map((key) => ({
            id: key,
            name: equipmentData[key].name,
          }));
          setEquipments(equipmentList);
        }
      } catch (error) {
        console.error("Error fetching equipment options:", error);
      }
    };

    fetchEquipments();
  }, [classData]);

  const resetForm = () => {
    setClassName("");
    setClassLocation("");
    setClassCapacity(0);
    setClassImage(null);
    setSelectedEquipment("");
    setClassEquipments([]);
  };

  const handleUpdateClass = async () => {
    try {
      if (!className || !classLocation || classCapacity <= 0) {
        console.error("Please fill in all the required class details.");
        return;
      }

      // Create a new class reference using the existing key
      const db = getDatabase();
      const updatedClassRef = databaseRef(db, `classes/${classData.key}`);

      // Update class data
      const updatedClass = {
        id: classData.id,
        name: className,
        location: classLocation,
        capacity: classCapacity,
        imageUrl: classData.imageUrl,
        equipments: classEquipments,
        key: classData.key,
      };

      // Upload updated class image to Firebase Storage if a new image is selected
      if (classImage) {
        // Delete the old class image from Firebase Storage using a child reference
        const oldImageRef = storageRef(storage, `classImages/${classData.id}`);
        await deleteObject(oldImageRef);

        // Generate a new ID for the class
        const classId = Date.now().toString();

        // Upload the new class image
        const newImageRef = storageRef(storage, `classImages/${classId}`);
        await uploadBytes(newImageRef, classImage);

        // Get the download URL of the uploaded image
        const imageUrl = await getDownloadURL(newImageRef);

        // Update class data with the new image URL and new ID
        updatedClass.imageUrl = imageUrl;
        updatedClass.id = classId;
      }

      // Update the class in the Firebase Realtime Database
      await set(updatedClassRef, updatedClass);

      console.log("Class updated successfully.");
      handleClose();
    } catch (error) {
      console.error("Error updating class:", error);
    }
  };

  const handleAddEquipment = () => {
    if (selectedEquipment && !classEquipments.includes(selectedEquipment)) {
      setClassEquipments([...classEquipments, selectedEquipment]);
    }
  };

  const handleRemoveEquipment = (equipment) => {
    const updatedEquipments = classEquipments.filter((e) => e !== equipment);
    setClassEquipments(updatedEquipments);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Class - {className}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Class Name:</Form.Label>
            <Form.Control
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Class Location:</Form.Label>
            <Form.Control
              type="text"
              value={classLocation}
              onChange={(e) => setClassLocation(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Class Capacity:</Form.Label>
            <Form.Control
              type="number"
              value={classCapacity}
              onChange={(e) => setClassCapacity(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Class Image:</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setClassImage(e.target.files[0])}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Equipment:</Form.Label>
            <Form.Control
              as="select"
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
            >
              <option value="">Select Equipment</option>
              {equipments.map((equipment) => (
                <option key={equipment.id} value={equipment.name}>
                  {equipment.name}
                </option>
              ))}
            </Form.Control>
            <Button
              variant="primary"
              onClick={handleAddEquipment}
              className="mt-2"
            >
              Add Equipment
            </Button>
          </Form.Group>

          <ListGroup className="mb-3">
            <ListGroup.Item variant="info">Selected Equipments</ListGroup.Item>
            {classEquipments.map((equipment) => (
              <ListGroup.Item
                key={equipment}
                className="d-flex justify-content-between"
              >
                {equipment}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveEquipment(equipment)}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleUpdateClass}>
          Update Class
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditClass;
