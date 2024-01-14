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

const ManageLab = () => {
  const [labs, setLabs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLab, setSelectedLab] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const uniqueEquipments = Array.from(
    new Set(labs.flatMap((lab) => lab.equipments || []))
  );

  const uniqueSoftwares = Array.from(
    new Set(
      labs.flatMap((lab) =>
        (lab.softwares || []).map((software) => software.name)
      )
    )
  );

  // New state variables for filters
  const [capacityFilter, setCapacityFilter] = useState("all"); // "all", "lt30", "31-40", "gt40"
  const [equipmentFilter, setEquipmentFilter] = useState("all");
  const [softwareFilter, setSoftwareFilter] = useState("all");

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

  const applyFilters = (lab) => {
    // Capacity filter
    const isCapacityMatch =
      (capacityFilter === "lt30" && lab.capacity < 30) ||
      (capacityFilter === "31-40" &&
        lab.capacity >= 31 &&
        lab.capacity <= 40) ||
      (capacityFilter === "gt40" && lab.capacity > 40) ||
      capacityFilter === "all";

    // Equipment filter
    const isEquipmentMatch =
      equipmentFilter === "all" ||
      (lab.equipments && lab.equipments.includes(equipmentFilter));

    // Software filter
    const isSoftwareMatch =
      softwareFilter === "all" ||
      (lab.softwares &&
        lab.softwares.some((software) => software.name === softwareFilter));

    return isCapacityMatch && isEquipmentMatch && isSoftwareMatch;
  };

  const capacityOptions = [
    { value: "all", label: "All Capacities" },
    { value: "lt30", label: "< 30" },
    { value: "31-40", label: "31-40" },
    { value: "gt40", label: "> 40" },
  ];

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

      {/* Filter options */}
      <Form className="mb-3">
        <Row>
          {/* Capacity filter */}
          <Col md={4} className="mb-3">
            <Form.Select
              onChange={(e) => setCapacityFilter(e.target.value)}
              value={capacityFilter}
            >
              {capacityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Equipment filter */}
          <Col md={4} className="mb-3">
            <Form.Select
              onChange={(e) => setEquipmentFilter(e.target.value)}
              value={equipmentFilter}
            >
              <option value="all">All Equipments</option>
              {uniqueEquipments.map((equipment, index) => (
                <option key={index} value={equipment}>
                  {equipment}
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Software filter */}
          <Col md={4} className="mb-3">
            <Form.Select
              onChange={(e) => setSoftwareFilter(e.target.value)}
              value={softwareFilter}
            >
              <option value="all">All Softwares</option>
              {uniqueSoftwares.map((software, index) => (
                <option key={index} value={software}>
                  {software}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Form>

      <Row xs={1} md={2} lg={4} xl={4} className="g-4">
        {labs
          .filter(
            (lab) =>
              lab.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
              applyFilters(lab)
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
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageLab;
