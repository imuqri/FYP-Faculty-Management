import React, { useState, useEffect } from "react";
import { getDatabase, ref as databaseRef, onValue } from "firebase/database";
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

  const uniqueEquipments = Array.from(
    new Set(facilities.flatMap((facility) => facility.equipments || []))
  );

  const uniqueSoftwares = Array.from(
    new Set(
      facilities.flatMap((facility) =>
        (facility.softwares || []).map((software) => software.name)
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
        const classesRef = databaseRef(db, "classes");

        // Use onValue to listen for changes
        onValue(labsRef, (snapshot) => {
          const labsData = snapshot.val();
          let facilitiesArray = [];

          if (labsData) {
            facilitiesArray = [...facilitiesArray, ...Object.values(labsData)];
          }

          setFacilities(facilitiesArray);
        });

        // Use onValue to listen for changes
        onValue(classesRef, (snapshot) => {
          const classesData = snapshot.val();
          let facilitiesArray = [...facilities];

          if (classesData) {
            facilitiesArray = [
              ...facilitiesArray,
              ...Object.values(classesData),
            ];
          }

          setFacilities(facilitiesArray);
        });
      } catch (error) {
        console.error("Error fetching facilities:", error);
      }
    };

    fetchData();
  }, []); // Dependency array to ensure the effect runs only once

  console.log("facilities", facilities);

  const handleCardClick = (facility) => {
    setSelectedFacility(facility);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFacility(null);
  };

  const applyFilters = (facility) => {
    // Capacity filter
    const isCapacityMatch =
      (capacityFilter === "lt30" && facility.capacity < 30) ||
      (capacityFilter === "31-40" &&
        facility.capacity >= 31 &&
        facility.capacity <= 40) ||
      (capacityFilter === "gt40" && facility.capacity > 40) ||
      capacityFilter === "all";

    // Equipment filter
    const isEquipmentMatch =
      equipmentFilter === "all" ||
      (facility.equipments && facility.equipments.includes(equipmentFilter));

    // Software filter
    const isSoftwareMatch =
      softwareFilter === "all" ||
      (facility.softwares &&
        facility.softwares.some(
          (software) => software.name === softwareFilter
        ));

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
      <h1 className="text-center mb-3">KPPIM FACILITIES</h1>
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
              {uniqueEquipments
                .sort((a, b) => a.localeCompare(b))
                .map((equipment, index) => (
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
              {uniqueSoftwares
                .sort((a, b) => a.localeCompare(b))
                .map((software, index) => (
                  <option key={index} value={software}>
                    {software}
                  </option>
                ))}
            </Form.Select>
          </Col>
        </Row>
      </Form>

      <Row xs={1} md={2} lg={4} xl={4} className="g-4">
        {facilities
          .filter(
            (facility) =>
              facility.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
              applyFilters(facility)
          )
          .sort((a, b) => a.name.localeCompare(b.name))
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
                      {selectedFacility.equipments
                        .sort((a, b) => a.localeCompare(b))
                        .map((equipment, index) => (
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
                      {selectedFacility.softwares
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((software, index) => (
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
