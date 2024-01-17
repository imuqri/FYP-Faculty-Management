import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import {
  Accordion,
  Container,
  Card,
  Row,
  Col,
  Button,
  Modal,
} from "react-bootstrap";

const DisplayAllReports = () => {
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      const db = getDatabase();
      const reportsRef = ref(db, "users");

      onValue(reportsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const reportsArray = [];
          for (let userId in data) {
            for (let reportId in data[userId].reports) {
              reportsArray.push({
                key: reportId,
                userId: userId,
                userEmail: data[userId].email,
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

  const markAsDone = (reportKey, userId) => {
    setSelectedReport({ key: reportKey, userId: userId });
    setShowModal(true);
  };

  const confirmMarkAsDone = () => {
    const { key, userId } = selectedReport;
    if (userId) {
      const db = getDatabase();
      update(ref(db, `users/${userId}/reports/${key}`), {
        status: "Done",
      });
    }
    setShowModal(false);
  };

  return (
    <Container className="mt-3">
      <h1 className="text-center mb-4">FACILITY REPORTS</h1>
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
        <Accordion defaultActiveKey="0">
          {reports
            .sort((a, b) => a.facilityName.localeCompare(b.facilityName))
            .map((report, index) => (
              <Accordion.Item key={index} eventKey={index.toString()}>
                <Accordion.Header>
                  <Row>
                    <Col>
                      <strong>
                        {report.facilityName} - {report.title}
                      </strong>
                    </Col>
                  </Row>
                  <Col className="text-end" style={{ marginRight: "10px" }}>
                    {report.status}
                  </Col>
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col md={6} className="d-flex justify-content-center">
                      <img
                        src={report.imageUrl}
                        alt={report.title}
                        style={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                          borderRadius: "15px",
                          marginBottom: "20px",
                        }}
                      />
                    </Col>
                    <Col md={6}>
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
                        <strong>Submitted By:</strong> {report.userEmail}
                      </p>
                      <p>
                        <strong>Date Submitted:</strong>{" "}
                        {new Date(report.timestamp).toLocaleString()}
                      </p>
                      <Col className="text-end mt-5">
                        {report.status === "Submitted" && (
                          <Button
                            onClick={() =>
                              markAsDone(report.key, report.userId)
                            }
                          >
                            Mark As Done
                          </Button>
                        )}
                      </Col>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            ))}
        </Accordion>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to mark this report as done?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmMarkAsDone}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DisplayAllReports;
