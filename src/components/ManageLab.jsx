import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref as databaseRef,
  onValue,
  get,
  remove,
} from "firebase/database";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Modal,
  Button,
} from "react-bootstrap";

const ManageLab = () => {
  const [labs, setLabs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLab, setSelectedLab] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase();
        const labsRef = databaseRef(db, "labs");

        const labsSnapshot = await get(labsRef);

        let labsArray = [];

        if (labsSnapshot.exists()) {
          const labsData = labsSnapshot.val();
          labsArray = [...labsArray, ...Object.values(labsData)];
        }

        setLabs(labsArray);
      } catch (error) {
        console.error("Error fetching labs:", error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (lab) => {
    setSelectedLab(lab);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLab(null);
  };

  const handleDeleteLab = async () => {
    try {
      const db = getDatabase();
      const labsRef = databaseRef(db, `labs/${selectedLab.key}`);
      await remove(labsRef);

      const storage = getStorage();
      const imageRef = storageRef(storage, selectedLab.imageUrl);
      await deleteObject(imageRef);

      const updatedLabs = labs.filter((lab) => lab.id !== selectedLab.id);
      setLabs(updatedLabs);
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting lab:", error);
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
        {labs
          .filter((lab) =>
            lab.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((lab) => (
            <Col key={lab.id}>
              <Card onClick={() => handleCardClick(lab)}>
                <Card.Img
                  variant="top"
                  src={lab.imageUrl}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{lab.name}</Card.Title>
                  <Card.Text>{lab.location}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Lab - {selectedLab?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <img
                src={selectedLab?.imageUrl}
                alt={selectedLab?.name}
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
                <strong>Name:</strong> {selectedLab?.name}
              </p>
              <p>
                <strong>Location:</strong> {selectedLab?.location}
              </p>
              <p>
                <strong>Capacity:</strong> {selectedLab?.capacity}
              </p>

              {selectedLab?.equipments && selectedLab.equipments.length > 0 && (
                <div>
                  <strong>Equipments:</strong>
                  <ul>
                    {selectedLab.equipments.map((equipment, index) => (
                      <li key={index}>{equipment}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedLab?.softwares && selectedLab.softwares.length > 0 && (
                <div>
                  <strong>Softwares:</strong>
                  <ul>
                    {selectedLab.softwares.map((software, index) => (
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
          <Button variant="danger" onClick={handleDeleteLab}>
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

export default ManageLab;
