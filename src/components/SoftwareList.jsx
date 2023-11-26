import React, { useState, useEffect } from 'react';
import { ref, onValue, remove, update } from 'firebase/database';
import { database } from '../firebase';
import { Accordion, Button, Modal, Form, ListGroup, Card } from 'react-bootstrap';

const SoftwareList = () => {
  const [softwareList, setSoftwareList] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSoftwareId, setEditSoftwareId] = useState('');
  const [newSoftwareName, setNewSoftwareName] = useState('');
  const [showEditVersionModal, setShowEditVersionModal] = useState(false);
  const [editVersionIndex, setEditVersionIndex] = useState(null);
  const [newVersion, setNewVersion] = useState('');

  useEffect(() => {
    const softwareRef = ref(database, 'softwares');
    onValue(softwareRef, (snapshot) => {
      if (snapshot.exists()) {
        const softwareData = snapshot.val();
        const softwareArray = Object.entries(softwareData).map(([id, data]) => ({
          id,
          name: data.name,
          versions: Array.isArray(data.versions) ? data.versions : Object.values(data.versions),
        }));
        setSoftwareList(softwareArray);
      }
    });
  }, []);

  const handleDeleteSoftware = (id) => {
    const softwareRef = ref(database, `softwares/${id}`);
    remove(softwareRef)
      .then(() => {
        console.log('Software deleted successfully.');
      })
      .catch((error) => {
        console.error('Error deleting software:', error);
      });
  };

  const handleShowEditModal = (id) => {
    setShowEditModal(true);
    setEditSoftwareId(id);
    const software = softwareList.find((software) => software.id === id);
    setNewSoftwareName(software.name);
  };

  const handleEditSoftware = () => {
    const softwareRef = ref(database, `softwares/${editSoftwareId}`);
    update(softwareRef, { name: newSoftwareName })
      .then(() => {
        console.log('Software name updated successfully.');
        setShowEditModal(false);
      })
      .catch((error) => {
        console.error('Error updating software name:', error);
      });
  };

  const handleShowEditVersionModal = (softwareIndex, versionIndex) => {
    setShowEditVersionModal(true);
    setEditSoftwareId(softwareIndex);
    setEditVersionIndex(versionIndex);
    const version = softwareList[softwareIndex].versions[versionIndex];
    setNewVersion(version);
  };

  const handleEditVersion = () => {
    const updatedVersions = [...softwareList[editSoftwareId].versions];
    updatedVersions[editVersionIndex] = newVersion;

    const softwareRef = ref(database, `softwares/${softwareList[editSoftwareId].id}`);
    update(softwareRef, { versions: updatedVersions })
      .then(() => {
        console.log('Version updated successfully.');
        setShowEditVersionModal(false);
      })
      .catch((error) => {
        console.error('Error updating version:', error);
      });
  };

  const handleDeleteVersion = (softwareIndex, versionIndex) => {
    const updatedVersions = [...softwareList[softwareIndex].versions];
    updatedVersions.splice(versionIndex, 1);

    const softwareRef = ref(database, `softwares/${softwareList[softwareIndex].id}`);
    update(softwareRef, { versions: updatedVersions })
      .then(() => {
        console.log('Version deleted successfully.');
      })
      .catch((error) => {
        console.error('Error deleting version:', error);
      });
  };

  return (
    <div className="container mt-5">
      <h2>Software List</h2>
      {softwareList.map((software, softwareIndex) => (
        <Card key={software.id} className="mb-3">
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Card.Header className="d-flex justify-content-between align-items-center">
                {software.name}
                <div>
                  <Button variant="primary" className="me-2" onClick={() => handleShowEditModal(software.id)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteSoftware(software.id)}>
                    Delete
                  </Button>
                </div>
              </Card.Header>
              <Accordion.Body>
                <ListGroup>
                  {software.versions.map((version, versionIndex) => (
                    <ListGroup.Item key={versionIndex} className="d-flex justify-content-between align-items-center">
                      {version}
                      <div>
                        <Button variant="primary" className="me-2" onClick={() => handleShowEditVersionModal(softwareIndex, versionIndex)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteVersion(softwareIndex, versionIndex)}>
                          Delete
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card>
      ))}

      {/* Edit Software Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Software Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Enter new software name"
            value={newSoftwareName}
            onChange={(e) => setNewSoftwareName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSoftware}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Version Modal */}
      <Modal show={showEditVersionModal} onHide={() => setShowEditVersionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Version</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Enter new version"
            value={newVersion}
            onChange={(e) => setNewVersion(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditVersionModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditVersion}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SoftwareList;