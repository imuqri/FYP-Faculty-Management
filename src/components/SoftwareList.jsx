import React, { useState, useEffect } from "react";
import { ref, onValue, remove, update } from "firebase/database";
import { database } from "../firebase";
import { Button, Modal, Form, ListGroup, Card } from "react-bootstrap";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineDeleteForever, MdOutlineEditNote } from "react-icons/md";

const SoftwareList = () => {
  const [softwareList, setSoftwareList] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSoftwareId, setEditSoftwareId] = useState("");
  const [newSoftwareName, setNewSoftwareName] = useState("");
  const [showEditVersionModal, setShowEditVersionModal] = useState(false);
  const [editVersionIndex, setEditVersionIndex] = useState(null);
  const [newVersion, setNewVersion] = useState("");
  const [showAddVersionModal, setShowAddVersionModal] = useState(false);
  const [newVersionInput, setNewVersionInput] = useState("");
  const [openSoftwareList, setOpenSoftwareList] = useState([]);

  useEffect(() => {
    const softwareRef = ref(database, "softwares");
    onValue(softwareRef, (snapshot) => {
      if (snapshot.exists()) {
        const softwareData = snapshot.val();
        const softwareArray = Object.entries(softwareData).map(
          ([id, data]) => ({
            id,
            name: data.name,
            versions: Array.isArray(data.versions)
              ? data.versions
              : Object.values(data.versions),
          })
        );
        setSoftwareList(softwareArray);
      }
    });
  }, []);

  const handleDeleteSoftware = (id) => {
    const softwareRef = ref(database, `softwares/${id}`);
    remove(softwareRef)
      .then(() => {
        console.log("Software deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting software:", error);
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
        console.log("Software name updated successfully.");
        setShowEditModal(false);
      })
      .catch((error) => {
        console.error("Error updating software name:", error);
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
    const softwareRef = ref(
      database,
      `softwares/${softwareList[editSoftwareId].id}`
    );
    update(softwareRef, { versions: updatedVersions })
      .then(() => {
        console.log("Version updated successfully.");
        setShowEditVersionModal(false);
      })
      .catch((error) => {
        console.error("Error updating version:", error);
      });
  };

  const handleDeleteVersion = (softwareIndex, versionIndex) => {
    const updatedVersions = [...softwareList[softwareIndex].versions];
    updatedVersions.splice(versionIndex, 1);
    const softwareRef = ref(
      database,
      `softwares/${softwareList[softwareIndex].id}`
    );
    update(softwareRef, { versions: updatedVersions })
      .then(() => {
        console.log("Version deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting version:", error);
      });
  };

  const handleShowAddVersionModal = (software) => {
    setShowAddVersionModal(true);
    setEditSoftwareId(software.id);
  };

  const handleAddVersion = () => {
    const currentSoftware = softwareList.find(
      (software) => software.id === editSoftwareId
    );

    if (currentSoftware && currentSoftware.versions !== undefined) {
      const updatedVersions = [...currentSoftware.versions, newVersionInput];

      const softwareRef = ref(database, `softwares/${editSoftwareId}`);
      update(softwareRef, { versions: updatedVersions })
        .then(() => {
          console.log("Version added successfully.");
          setShowAddVersionModal(false);
          setNewVersionInput("");
        })
        .catch((error) => {
          console.error("Error adding version:", error);
        });
    } else {
      console.error(
        "Invalid software or versions data:",
        editSoftwareId,
        softwareList
      );
    }
  };

  const toggleSoftware = (index) => {
    setOpenSoftwareList((prevOpenSoftwareList) => {
      if (prevOpenSoftwareList.includes(index)) {
        // Remove index if it exists, closing the software
        return prevOpenSoftwareList.filter((item) => item !== index);
      } else {
        // Add index if it doesn't exist, opening the software
        return [...prevOpenSoftwareList, index];
      }
    });
  };

  // Edit Software Modal
  const editSoftwareModal = (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
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
  );

  // Edit Version Modal
  const editVersionModal = (
    <Modal
      show={showEditVersionModal}
      onHide={() => setShowEditVersionModal(false)}
      centered
    >
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
        <Button
          variant="secondary"
          onClick={() => setShowEditVersionModal(false)}
        >
          Close
        </Button>
        <Button variant="primary" onClick={handleEditVersion}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );

  // Add Version Modal
  const addVersionModal = (
    <Modal
      show={showAddVersionModal}
      onHide={() => setShowAddVersionModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Version</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          placeholder="Enter new version"
          value={newVersionInput}
          onChange={(e) => setNewVersionInput(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setShowAddVersionModal(false)}
        >
          Close
        </Button>
        <Button variant="primary" onClick={handleAddVersion}>
          Add Version
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <div className="container mt-2">
      {softwareList
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((software, softwareIndex) => (
          <Card key={software.id} className="mb-2">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div
                onClick={() => toggleSoftware(softwareIndex)}
                style={{ cursor: "pointer" }}
              >
                {openSoftwareList.includes(softwareIndex) ? (
                  <BsChevronUp />
                ) : (
                  <BsChevronDown />
                )}
                {software.name}
              </div>
              <div className="d-flex flex-column flex-md-row">
                <Button
                  variant="primary"
                  className="me-1 mb-1 mb-md-0"
                  style={{ width: "40px" }} // Set a fixed width
                  onClick={() => handleShowEditModal(software.id)}
                >
                  <MdOutlineEditNote />
                </Button>
                <Button
                  variant="danger"
                  style={{ width: "40px" }} // Set a fixed width
                  onClick={() => handleDeleteSoftware(software.id)}
                >
                  <MdOutlineDeleteForever />
                </Button>
              </div>
            </Card.Header>
            {openSoftwareList.includes(softwareIndex) && (
              <Card.Body>
                <ListGroup>
                  {software.versions.map((version, versionIndex) => (
                    <ListGroup.Item
                      key={versionIndex}
                      className="d-flex justify-content-between align-items-center"
                    >
                      {version}
                      <div className="d-flex flex-column flex-md-row">
                        <Button
                          variant="primary"
                          className="me-1 mb-1 mb-md-0"
                          style={{ width: "40px" }} // Set a fixed width
                          onClick={() =>
                            handleShowEditVersionModal(
                              softwareIndex,
                              versionIndex
                            )
                          }
                        >
                          <MdOutlineEditNote />
                        </Button>
                        <Button
                          variant="danger"
                          style={{ width: "40px" }} // Set a fixed width
                          onClick={() =>
                            handleDeleteVersion(softwareIndex, versionIndex)
                          }
                        >
                          <MdOutlineDeleteForever />
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Button
                  variant="success"
                  className="mt-3"
                  onClick={() => handleShowAddVersionModal(software)}
                >
                  Add Version
                </Button>
              </Card.Body>
            )}
          </Card>
        ))}
      {editSoftwareModal}
      {editVersionModal}
      {addVersionModal}
    </div>
  );
};

export default SoftwareList;
