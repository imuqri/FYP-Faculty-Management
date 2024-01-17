import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Container, Card, Row, Col } from 'react-bootstrap';

const DisplayAllReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const db = getDatabase();
      const reportsRef = ref(db, 'users');

      onValue(reportsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const reportsArray = [];
          for (let userId in data) {
            for (let reportId in data[userId].reports) {
              reportsArray.push({
                key: reportId,
                ...data[userId].reports[reportId],
              });
            }
          }
          setReports(reportsArray);
        } else {
          setReports([]);
        }
      });
    };

    fetchReports();
  }, []);

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
                    <strong>Reported by:</strong> {report.userEmail}
                  </p>
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

export default DisplayAllReports;