import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref as databaseRef,
  onValue,
  get,
} from "firebase/database";
import { Container, Card, Row, Col, Form } from "react-bootstrap";

const DisplayFacility = () => {
  const [facilities, setFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter facilities based on the search term
  const filteredFacilities = facilities.filter((facility) =>
    facility.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {filteredFacilities.map((facility) => (
          <Col key={facility.id}>
            <Card>
              <Card.Img
                variant="top"
                src={facility.imageUrl}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{facility.name}</Card.Title>
                <Card.Text>{facility.location}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default DisplayFacility;
