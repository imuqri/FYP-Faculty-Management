import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref as databaseRef,
  onValue,
  remove,
} from "firebase/database";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Modal,
  Button,
} from "react-bootstrap";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";

const ManageClass = () => {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase();
        const classesRef = databaseRef(db, "classes");

        // Use onValue to listen for changes
        onValue(classesRef, (snapshot) => {
          const classesData = snapshot.val();
          let classesArray = [];

          if (classesData) {
            classesArray = [...classesArray, ...Object.values(classesData)];
          }

          setClasses(classesArray);
        });
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (classItem) => {
    if (!showModal) {
      setSelectedClass(classItem);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClass(null);
  };

  const handleDeleteClass = async () => {
    try {
      // Delete data from the Realtime Database
      const db = getDatabase();
      const classRef = databaseRef(db, `classes/${selectedClass.key}`);
      await remove(classRef);

      // Delete image from storage
      const storage = getStorage();
      const imageRef = storageRef(storage, selectedClass.imageUrl);
      await deleteObject(imageRef);

      const updatedClasses = classes.filter(
        (classItem) => classItem.id !== selectedClass.id
      );
      setClasses(updatedClasses);
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  return (
    <Container className="mt-3 mb-3">
      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      <Row xs={1} md={2} lg={4} xl={4} className="g-4">
        {classes
          .filter((classItem) =>
            classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((classItem) => (
            <Col key={classItem.id}>
              <Card onClick={() => handleCardClick(classItem)}>
                <Card.Img
                  variant="top"
                  src={classItem.imageUrl}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{classItem.name}</Card.Title>
                  <Card.Text>{classItem.location}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Class - {selectedClass?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <img
                src={selectedClass?.imageUrl}
                alt={selectedClass?.name}
                style={{
                  width: "100%",
                  height: "350px",
                  objectFit: "cover",
                  borderRadius: "15px",
                  marginBottom: "20px",
                }}
              />
            </Col>
            <Col md={6}>
              <p>
                <strong>Name:</strong> {selectedClass?.name}
              </p>
              <p>
                <strong>Location:</strong> {selectedClass?.location}
              </p>
              <p>
                <strong>Capacity:</strong> {selectedClass?.capacity}
              </p>

              {selectedClass?.equipments &&
                selectedClass.equipments.length > 0 && (
                  <div>
                    <strong>Equipments:</strong>
                    <ul>
                      {selectedClass.equipments
                        .sort((a, b) => a.localeCompare(b))
                        .map((equipment, index) => (
                          <li key={index}>{equipment}</li>
                        ))}
                    </ul>
                  </div>
                )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteClass}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageClass;
