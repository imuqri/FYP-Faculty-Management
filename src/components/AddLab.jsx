import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref as databaseRef,
  push,
  onValue,
  get,
  update,
} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { Container, Card, Form, Button, ListGroup } from "react-bootstrap";

const AddLab = () => {
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
  const [selectedSoftwareVersions, setSelectedSoftwareVersions] = useState([]);

  const auth = getAuth();
  const storage = getStorage();
  const labs = databaseRef(getDatabase(), "labs");

  useEffect(() => {
    // Fetch equipments from the database
    const equipmentsRef = databaseRef(getDatabase(), "equipments");
    onValue(equipmentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const equipmentData = snapshot.val();
        const equipmentList = Object.keys(equipmentData).map((key) => ({
          id: key,
          name: equipmentData[key].name,
        }));
        setEquipments(equipmentList);
      }
    });

    // Fetch softwares and versions from the database
    const softwaresRef = databaseRef(getDatabase(), "softwares");
    onValue(softwaresRef, (snapshot) => {
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
    });
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

  const handleAddLab = async () => {
    if (!labName || !labLocation || labCapacity <= 0 || !labImage) {
      console.error("Please fill in all the lab details.");
      return;
    }

    const labId = Date.now().toString(); // Unique ID for the lab

    // Upload lab image to Firebase Storage
    const imageRef = storageRef(storage, `labImages/${labId}`);
    await uploadBytes(imageRef, labImage);

    // Get the download URL of the uploaded image
    const imageUrl = await getDownloadURL(imageRef);

    // Create a new lab object
    const newLab = {
      id: labId,
      name: labName,
      location: labLocation,
      capacity: labCapacity,
      imageUrl: imageUrl,
      equipments: labEquipments,
      softwares: labSoftwares,
    };

    // Push the lab data to the "labs" node in the Firebase Realtime Database
    const newLabRef = push(labs, newLab);

    // Firebase generates a unique key for each pushed object
    // You can get this key using the key property of the reference
    const key = newLabRef.key;

    // Store the key in the lab object
    update(newLabRef, { key: key })
      .then(() => {
        console.log("Lab added successfully.");
        resetForm();
      })
      .catch((error) => {
        console.error("Error adding lab:", error);
      });
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
    <Container className="mt-3 mb-3">
      <Card>
        <Card.Body className="d-flex flex-column">
          <Card.Title as="h2">Add Lab</Card.Title>

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

          <Button
            variant="primary"
            onClick={handleAddLab}
            className="align-self-end"
          >
            Add Lab
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddLab;
