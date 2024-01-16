import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref as databaseRef,
  push,
  onValue,
  update,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { Container, Card, Form, Button, ListGroup } from "react-bootstrap";

const storage = getStorage();
const AddClass = () => {
  const [className, setClassName] = useState("");
  const [classLocation, setClassLocation] = useState("");
  const [classCapacity, setClassCapacity] = useState(0);
  const [classImage, setClassImage] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [classEquipments, setClassEquipments] = useState([]);

  const classes = databaseRef(getDatabase(), "classes");

  useEffect(() => {
    // Fetch equipments from the database
    const equipmentsRef = databaseRef(getDatabase(), "equipments");
    onValue(equipmentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const equipmentData = snapshot.val();
        const equipmentList = Object.keys(equipmentData).map((key) => ({
          id: key,
          name: equipmentData[key].name,
        }));
        setEquipments(equipmentList);
      }
    });
  }, []);

  const resetForm = () => {
    setClassName("");
    setClassLocation("");
    setClassCapacity(0);
    setClassImage(null);
    setSelectedEquipment("");
    setClassEquipments([]);
  };

  const handleAddClass = async () => {
    if (!className || !classLocation || classCapacity <= 0 || !classImage) {
      console.error("Please fill in all the class details.");
      return;
    }

    const classId = Date.now().toString(); // Unique ID for the class

    const imageRef = storageRef(storage, `classImages/${classId}`);
    await uploadBytes(imageRef, classImage);

    // Get the download URL of the uploaded image
    const imageUrl = await getDownloadURL(imageRef);

    // Create a new class object
    const newClass = {
      id: classId,
      name: className,
      location: classLocation,
      capacity: classCapacity,
      imageUrl: imageUrl,
      equipments: classEquipments,
    };

    const newClassRef = push(classes, newClass);
    const key = newClassRef.key;

    // Push the class data to the "classes" node in the Firebase Realtime Database
    update(newClassRef, { key: key })
      .then(() => {
        console.log("Class added successfully.");
        resetForm();
      })
      .catch((error) => {
        console.error("Error adding lab:", error);
      });
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
    <Container className="mt-3 mb-3">
      <Card>
        <Card.Body className="d-flex flex-column">
          <Card.Title as="h2">Add Class</Card.Title>

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
            <Form.Label>Lab Image:</Form.Label>
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
              {equipments
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((equipment) => (
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
            {classEquipments
              .sort((a, b) => a.localeCompare(b))
              .map((equipment) => (
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

          <Button
            variant="primary"
            onClick={handleAddClass}
            className="align-self-end"
          >
            Add Class
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddClass;
