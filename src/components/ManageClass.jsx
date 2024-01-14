import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref as databaseRef,
  onValue,
  get,
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

  const uniqueEquipments = Array.from(
    new Set(classes.flatMap((classItem) => classItem.equipments || []))
  );

  const uniqueSoftwares = Array.from(
    new Set(
      classes.flatMap((classItem) =>
        (classItem.softwares || []).map((software) => software.name)
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
        const classesRef = databaseRef(db, "classes");

        const classesSnapshot = await get(classesRef);

        let classesArray = [];

        if (classesSnapshot.exists()) {
          const classesData = classesSnapshot.val();
          classesArray = [...classesArray, ...Object.values(classesData)];
        }

        setClasses(classesArray);
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

  const applyFilters = (classItem) => {
    // Capacity filter
    const isCapacityMatch =
      (capacityFilter === "lt30" && classItem.capacity < 30) ||
      (capacityFilter === "31-40" &&
        classItem.capacity >= 31 &&
        classItem.capacity <= 40) ||
      (capacityFilter === "gt40" && classItem.capacity > 40) ||
      capacityFilter === "all";

    // Equipment filter
    const isEquipmentMatch =
      equipmentFilter === "all" ||
      (classItem.equipments && classItem.equipments.includes(equipmentFilter));

    // Software filter
    const isSoftwareMatch =
      softwareFilter === "all" ||
      (classItem.softwares &&
        classItem.softwares.some(
          (software) => software.name === softwareFilter
        ));

    return isCapacityMatch && isEquipmentMatch && isSoftwareMatch;
  };

  const handleDelete = async () => {
    try {
      // Delete data from the Realtime Database
      const db = getDatabase();
      const classRef = databaseRef(db, "classes", selectedClass.id);
      await remove(classRef);

      // Delete image from storage
      const storage = getStorage();
      const imageRef = storageRef(storage, selectedClass.imagePath);
      await deleteObject(imageRef);

      // After successful deletion, close the modal
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting class:", error);
    }
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
        {classes
          .filter(
            (classItem) =>
              classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
              applyFilters(classItem)
          )
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
                <Card.Footer>
                  <Button variant="danger" onClick={handleDelete}>
                    Delete
                  </Button>
                </Card.Footer>
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
                      {selectedClass.equipments.map((equipment, index) => (
                        <li key={index}>{equipment}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedClass?.softwares &&
                selectedClass.softwares.length > 0 && (
                  <div>
                    <strong>Softwares:</strong>
                    <ul>
                      {selectedClass.softwares.map((software, index) => (
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

export default ManageClass;
