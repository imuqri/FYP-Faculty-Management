import React, { useState, useEffect } from "react";
import { getDatabase, ref as databaseRef, set, get } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";

const EditLab = ({ lab, show, handleClose }) => {
  const [labName, setLabName] = useState("");
  const [labLocation, setLabLocation] = useState("");
  const [labCapacity, setLabCapacity] = useState(0);
  const [labImage, setLabImage] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedSoftware, setSelectedSoftware] = useState("");
  const [softwareVersions, setSoftwareVersions] = useState([]);
  const [selectedSoftwareVersion, setSelectedSoftwareVersion] = useState("");
  const [labEquipments, setLabEquipments] = useState([]);
  const [labSoftwares, setLabSoftwares] = useState([]);

  const storage = getStorage();
  const labRef = databaseRef(getDatabase(), "labs");
  const equipmentsRef = databaseRef(getDatabase(), "equipments");
  const softwaresRef = databaseRef(getDatabase(), "softwares");

  useEffect(() => {
    if (lab) {
      setLabName(lab.name || "");
      setLabLocation(lab.location || "");
      setLabCapacity(lab.capacity || 0);
      setLabEquipments(lab.equipments || []);
      setLabSoftwares(lab.softwares || []);
    }

    // Fetch equipment options from the database
    const fetchEquipments = async () => {
      try {
        const snapshot = await get(equipmentsRef);
        if (snapshot.exists()) {
          const equipmentData = snapshot.val();
          const equipmentList = Object.keys(equipmentData).map((key) => ({
            id: key,
            name: equipmentData[key].name,
          }));
          setEquipments(equipmentList);
        }
      } catch (error) {
        console.error("Error fetching equipment options:", error);
      }
    };

    // Fetch software options from the database
    const fetchSoftwares = async () => {
      try {
        const snapshot = await get(softwaresRef);
        if (snapshot.exists()) {
          const softwareData = snapshot.val();
          const softwareList = Object.keys(softwareData).map((key) => {
            const softwareVersions = Object.keys(
              softwareData[key].versions || {}
            ).map((versionKey) => softwareData[key].versions[versionKey]);
            return {
              id: key,
              name: softwareData[key].name,
              versions: softwareVersions,
            };
          });
          setSoftwares(softwareList);
        }
      } catch (error) {
        console.error("Error fetching software options:", error);
      }
    };

    fetchEquipments();
    fetchSoftwares();
  }, []);

  const resetForm = () => {
    setLabName("");
    setLabLocation("");
    setLabCapacity(0);
    setLabImage(null);
    setSelectedEquipment("");
    setSelectedSoftware("");
    setSelectedSoftwareVersion("");
    setLabEquipments([]);
    setLabSoftwares([]);
  };

  const handleUpdateLab = async () => {
    try {
      if (!labName || !labLocation || labCapacity <= 0) {
        console.error("Please fill in all the required lab details.");
        return;
      }

      // Create a new lab reference using the existing key
      const db = getDatabase();
      const updatedLabRef = databaseRef(db, `labs/${lab.key}`);

      // Update lab data
      const updatedLab = {
        id: lab.id,
        name: labName,
        location: labLocation,
        capacity: labCapacity,
        imageUrl: lab.imageUrl,
        equipments: labEquipments,
        softwares: labSoftwares,
        key: lab.key,
      };

      // Upload updated lab image to Firebase Storage if a new image is selected
      if (labImage) {
        // Delete the old lab image from Firebase Storage using a child reference
        const oldImageRef = storageRef(storage, `labImages/${lab.id}`);
        await deleteObject(oldImageRef);

        // Generate a new ID for the lab
        const labId = Date.now().toString();

        // Upload the new lab image
        const newImageRef = storageRef(storage, `labImages/${labId}`);
        await uploadBytes(newImageRef, labImage);

        // Get the download URL of the uploaded image
        const imageUrl = await getDownloadURL(newImageRef);

        // Update lab data with the new image URL and new ID
        updatedLab.imageUrl = imageUrl;
        updatedLab.id = labId;
      }

      // Update the lab in the Firebase Realtime Database
      await set(updatedLabRef, updatedLab);

      console.log("Lab updated successfully.");
      handleClose();
    } catch (error) {
      console.error("Error updating lab:", error);
    }
  };

  const handleAddEquipment = () => {
    if (selectedEquipment && !labEquipments.includes(selectedEquipment)) {
      setLabEquipments([...labEquipments, selectedEquipment]);
    }
  };

  const handleAddSoftware = () => {
    if (
      selectedSoftware &&
      selectedSoftwareVersion &&
      !labSoftwares.some(
        (software) =>
          software.name === selectedSoftware &&
          software.version === selectedSoftwareVersion
      )
    ) {
      setLabSoftwares([
        ...labSoftwares,
        { name: selectedSoftware, version: selectedSoftwareVersion },
      ]);
    }
  };

  const handleSoftwareChange = (softwareName) => {
    setSelectedSoftware(softwareName);

    // Retrieve versions from the state
    const selectedSoftware = softwares.find(
      (software) => software.name === softwareName
    );
    if (selectedSoftware) {
      console.log("Selected Software Data:", selectedSoftware);
      setSoftwareVersions(selectedSoftware.versions);
      setSelectedSoftwareVersion(""); // Reset selected version
    }
  };

  const handleRemoveEquipment = (equipment) => {
    const updatedEquipments = labEquipments.filter((e) => e !== equipment);
    setLabEquipments(updatedEquipments);
  };

  const handleRemoveSoftware = (software) => {
    const updatedSoftwares = labSoftwares.filter(
      (s) => s.name !== software.name || s.version !== software.version
    );
    setLabSoftwares(updatedSoftwares);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Lab - {labName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Lab Name:</Form.Label>
            <Form.Control
              type="text"
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lab Location:</Form.Label>
            <Form.Control
              type="text"
              value={labLocation}
              onChange={(e) => setLabLocation(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lab Capacity:</Form.Label>
            <Form.Control
              type="number"
              value={labCapacity}
              onChange={(e) => setLabCapacity(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lab Image:</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setLabImage(e.target.files[0])}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Equipment:</Form.Label>
            <Form.Control
              as="select"
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
            >
              <option value="">Select Equipment</option>
              {equipments.map((equipment) => (
                <option key={equipment.id} value={equipment.name}>
                  {equipment.name}
                </option>
              ))}
            </Form.Control>
            <Button
              variant="primary"
              onClick={handleAddEquipment}
              className="mt-2"
            >
              Add Equipment
            </Button>
          </Form.Group>

          <ListGroup className="mb-3">
            <ListGroup.Item variant="info">Selected Equipments</ListGroup.Item>
            {labEquipments.map((equipment) => (
              <ListGroup.Item
                key={equipment}
                className="d-flex justify-content-between"
              >
                {equipment}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveEquipment(equipment)}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <Form.Group className="mb-3">
            <Form.Label>Select Software:</Form.Label>
            <Form.Control
              as="select"
              value={selectedSoftware}
              onChange={(e) => handleSoftwareChange(e.target.value)}
            >
              <option value="">Select Software</option>
              {softwares.map((software) => (
                <option key={software.id} value={software.name}>
                  {software.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {selectedSoftware && (
            <Form.Group className="mb-3">
              <Form.Label>Select Software Version:</Form.Label>
              <Form.Control
                as="select"
                value={selectedSoftwareVersion}
                onChange={(e) => setSelectedSoftwareVersion(e.target.value)}
              >
                <option value="">Select Version</option>
                {softwareVersions.map((version) => (
                  <option key={version} value={version}>
                    {version}
                  </option>
                ))}
              </Form.Control>

              <Button
                variant="primary"
                onClick={handleAddSoftware}
                className="mt-2"
              >
                Add Software
              </Button>
            </Form.Group>
          )}

          <ListGroup className="mb-3">
            <ListGroup.Item variant="success">
              Selected Softwares
            </ListGroup.Item>
            {labSoftwares.map((software) => (
              <ListGroup.Item
                key={`${software.name}-${software.version}`}
                className="d-flex justify-content-between"
              >
                {`${software.name} - ${software.version}`}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveSoftware(software)}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleUpdateLab}>
          Update Lab
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditLab;
