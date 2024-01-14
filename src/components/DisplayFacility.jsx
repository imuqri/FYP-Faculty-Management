import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref as databaseRef,
  onValue,
  get,
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

const DisplayFacility = () => {
  const [facilities, setFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase();
        const labsRef = databaseRef(db, "labs");
        const classesRef = databaseRef(db, "classes");

        const labsSnapshot = await get(labsRef);
        const classesSnapshot = await get(classesRef);

        if (labsSnapshot.exists()) {
          const labsData = labsSnapshot.val();
          const labsArray = Object.values(labsData);
          setFacilities((prevFacilities) => [...prevFacilities, ...labsArray]);
        }

        if (classesSnapshot.exists()) {
          const classesData = classesSnapshot.val();
          const classesArray = Object.values(classesData);
          setFacilities((prevFacilities) => [
            ...prevFacilities,
            ...classesArray,
          ]);
        }
      } catch (error) {
        console.error("Error fetching facilities:", error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (facility) => {
    setSelectedFacility(facility);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFacility(null);
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
        {facilities
          .filter((facility) =>
            facility.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((facility) => (
            <Col key={facility.id}>
              <Card onClick={() => handleCardClick(facility)}>
                <Card.Img
                  variant="top"
                  src={facility.imageUrl}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{facility.name}</Card.Title>
                  <Card.Text>{facility.location}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Facility - {selectedFacility?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <img
                src={selectedFacility?.imageUrl}
                alt={selectedFacility?.name}
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
                <strong>Name:</strong> {selectedFacility?.name}
              </p>
              <p>
                <strong>Location:</strong> {selectedFacility?.location}
              </p>
              <p>
                <strong>Capacity:</strong> {selectedFacility?.capacity}
              </p>

              {selectedFacility?.equipments &&
                selectedFacility.equipments.length > 0 && (
                  <div>
                    <strong>Equipments:</strong>
                    <ul>
                      {selectedFacility.equipments.map((equipment, index) => (
                        <li key={index}>{equipment}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedFacility?.softwares &&
                selectedFacility.softwares.length > 0 && (
                  <div>
                    <strong>Softwares:</strong>
                    <ul>
                      {selectedFacility.softwares.map((software, index) => (
                        <li
                          key={index}
                        >{`${software.name} - ${software.version}`}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DisplayFacility;
