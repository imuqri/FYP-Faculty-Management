import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import { Container, Card, Col, Row } from "react-bootstrap";

const UserReport = () => {
  const [reports, setReports] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const fetchReports = async () => {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const db = getDatabase();
        const reportsRef = ref(db, `users/${userId}/reports`);

        onValue(reportsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const reportsArray = Object.keys(data).map((key) => {
              return {
                key,
                ...data[key],
              };
            });
            setReports(reportsArray);
          } else {
            setReports([]);
          }
        });
      }
    };

    fetchReports();
  }, [auth.currentUser]);

  return (
    <Container className="mt-3">
      {reports.length === 0 ? (
        <Card className="mb-3">
          <Card.Body>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ height: "100%" }}
            >
              <p>No reports made</p>
            </div>
          </Card.Body>
        </Card>
      ) : (
        reports.map((report, index) => (
          <Card key={index} className="mb-3">
            <Card.Header>
              <Row>
                <Col>{report.title}</Col>
                <Col className="text-end">{report.status}</Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col xs={6}>
                  <img
                    src={report.imageUrl}
                    alt={report.title}
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col xs={6}>
                  <p>
                    <strong>Facility Type:</strong> {report.facilityType}
                  </p>
                  <p>
                    <strong>Facility Name:</strong> {report.facilityName}
                  </p>
                  <p>
                    <strong>Details:</strong> {report.details}
                  </p>
                  <p>
                    <strong>Date Submitted:</strong>{" "}
                    {new Date(report.timestamp).toLocaleString()}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default UserReport;
