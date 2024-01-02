// AddLab.js
import React, { useState, useEffect } from "react";
import { ref, push, onValue } from "firebase/database";
import { database } from "../firebase"; // Replace with your actual Firebase configuration
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";

const AddLab = () => {
  const [labName, setLabName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [equipmentList, setEquipmentList] = useState([]);
  const [softwareList, setSoftwareList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedSoftware, setSelectedSoftware] = useState("");
  const [softwareVersionList, setSoftwareVersionList] = useState([]);
  const [selectedSoftwareVersion, setSelectedSoftwareVersion] = useState("");

  useEffect(() => {
    // Fetch equipment data from Firebase
    const fetchEquipmentData = async () => {
      try {
        const equipmentRef = ref(database, "equipments");
        const snapshot = await onValue(equipmentRef, (data) => {
          if (data.exists()) {
            setEquipmentList(Object.keys(data.val()));
          }
        });
      } catch (error) {
        console.error("Error fetching equipment data:", error);
      }
    };

    // Fetch software data from Firebase
    const fetchSoftwareData = async () => {
      try {
        const softwareRef = ref(database, "softwares");
        const snapshot = await onValue(softwareRef, (data) => {
          if (data.exists()) {
            setSoftwareList(Object.keys(data.val()));
          }
        });
      } catch (error) {
        console.error("Error fetching software data:", error);
      }
    };

    fetchEquipmentData();
    fetchSoftwareData();
  }, []);

  useEffect(() => {
    // Fetch software versions based on selected software
    const fetchSoftwareVersions = async () => {
      try {
        if (selectedSoftware) {
          const softwareVersionsRef = ref(
            database,
            `software/${selectedSoftware}/versions`
          );
          const snapshot = await onValue(softwareVersionsRef, (data) => {
            if (data.exists()) {
              setSoftwareVersionList(Object.keys(data.val()));
            }
          });
        }
      } catch (error) {
        console.error("Error fetching software versions:", error);
      }
    };

    fetchSoftwareVersions();
  }, [selectedSoftware]);

  const handleAddEquipment = () => {
    if (selectedEquipment && !equipmentList.includes(selectedEquipment)) {
      setEquipmentList((prevList) => [...prevList, selectedEquipment]);
    }
  };

  const handleAddSoftware = () => {
    if (selectedSoftware && !softwareList.includes(selectedSoftware)) {
      setSoftwareList((prevList) => [...prevList, selectedSoftware]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Handle form submission logic here
    console.log("Lab Name:", labName);
    console.log("Location:", location);
    console.log("Capacity:", capacity);
    console.log("Equipment List:", equipmentList);
    console.log("Software List:", softwareList);
    console.log("Selected Software Version:", selectedSoftwareVersion);

    // Reset form fields after submission
    setLabName("");
    setLocation("");
    setCapacity("");
    setEquipmentList([]);
    setSoftwareList([]);
    setSoftwareVersionList([]);
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <Card.Title as="h2">Add Lab</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="labName">
              <Form.Label>Lab Name</Form.Label>
              <Form.Control
                type="text"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="capacity">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="equipment">
              <Form.Label>Equipment</Form.Label>
              <Row>
                <Col xs={8}>
                  <Form.Control
                    as="select"
                    value={selectedEquipment}
                    onChange={(e) => setSelectedEquipment(e.target.value)}
                  >
                    {equipmentList.map((equipment) => (
                      <option key={equipment} value={equipment}>
                        {equipment}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
                <Col xs={4} className="d-flex align-items-end">
                  <Button variant="primary" onClick={handleAddEquipment}>
                    Add
                  </Button>
                </Col>
              </Row>
              {/* Display selected equipment list */}
              {equipmentList.length > 0 && (
                <div className="mt-2">
                  <strong>Selected Equipment:</strong>
                  <ul>
                    {equipmentList.map((equipment) => (
                      <li key={equipment}>{equipment}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Form.Group>

            <Form.Group controlId="software">
              <Form.Label>Software</Form.Label>
              <Row>
                <Col xs={8}>
                  <Form.Control
                    as="select"
                    value={selectedSoftware}
                    onChange={(e) => setSelectedSoftware(e.target.value)}
                  >
                    {softwareList.map((software) => (
                      <option key={software} value={software}>
                        {software}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
                <Col xs={4} className="d-flex align-items-end">
                  <Button variant="primary" onClick={handleAddSoftware}>
                    Add
                  </Button>
                </Col>
              </Row>
              {/* Display selected software list */}
              {softwareList.length > 0 && (
                <div className="mt-2">
                  <strong>Selected Software:</strong>
                  <ul>
                    {softwareList.map((software) => (
                      <li key={software}>{software}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Form.Group>

            <Form.Group controlId="softwareVersion">
              <Form.Label>Software Version</Form.Label>
              <Form.Control
                as="select"
                value={selectedSoftwareVersion}
                onChange={(e) => setSelectedSoftwareVersion(e.target.value)}
              >
                {softwareVersionList.map((version) => (
                  <option key={version} value={version}>
                    {version}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddLab;
