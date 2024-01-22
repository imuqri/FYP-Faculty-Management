import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import {
  Container,
  Accordion,
  Card,
  Col,
  Row,
  Button,
  Modal,
} from "react-bootstrap";

const UserReport = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
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

  const handleDelete = (report) => {
    setSelectedReport(report);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    const db = getDatabase();
    const user = auth.currentUser;
    const userId = user.uid;

    // Delete from Realtime Database
    const reportRef = ref(db, `users/${userId}/reports/${selectedReport.key}`);
    await remove(reportRef);

    // Delete from Firebase Storage
    const storage = getStorage();
    const imageRef = storageRef(storage, selectedReport.imageUrl);
    await deleteObject(imageRef);

    // Close the confirmation modal
    setShowConfirmation(false);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
  };

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
        <Accordion defaultActiveKey="0">
          {reports.reverse().map((report, index) => (
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
                      <strong>Report Title:</strong> {report.title}
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
                <Row className="text-end mt-3">
                  <Col>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(report)}
                    >
                      Delete Report
                    </Button>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={closeConfirmation} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this report?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConfirmation}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserReport;
