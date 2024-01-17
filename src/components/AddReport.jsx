import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref as databaseRef,
  get,
  ref,
  push,
  set,
} from "firebase/database";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { Container, Form, Button } from "react-bootstrap";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AddReport = () => {
  const [labs, setLabs] = useState([]);
  const [classes, setClasses] = useState([]);
  const [facilityType, setFacilityType] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  const auth = getAuth();
  const storage = getStorage();

  useEffect(() => {
    // Fetch facilities when the component mounts
    fetchFacilities();

    // Listen for changes in authentication status
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect or handle the case where the user is not authenticated
        console.log("User is not authenticated");
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [auth]);

  const fetchFacilities = async () => {
    try {
      const db = getDatabase();
      const labsRef = databaseRef(db, "labs");
      const classesRef = databaseRef(db, "classes");

      const labsSnapshot = await get(labsRef);
      const classesSnapshot = await get(classesRef);

      let labsArray = [];
      let classesArray = [];

      if (labsSnapshot.exists()) {
        const labsData = labsSnapshot.val();
        labsArray = Object.keys(labsData).map((key) => ({
          key,
          ...labsData[key],
        }));
      }

      if (classesSnapshot.exists()) {
        const classesData = classesSnapshot.val();
        classesArray = Object.keys(classesData).map((key) => ({
          key,
          ...classesData[key],
        }));
      }

      setLabs(labsArray);
      setClasses(classesArray);
      console.log("fetched labs:", labsArray);
      console.log("fetched Class", classesArray);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };

  const handleFacilityTypeChange = (e) => {
    setFacilityType(e.target.value);
    setFacilityName(""); // Reset the facility name when the type changes
  };

  const handleFacilityNameChange = (e) => {
    setFacilityName(e.target.value);
  };

  const handleImageChange = (e) => {
    // Handle image selection
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDetailsChange = (e) => {
    setDetails(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      const userId = user.uid;

      // Check if the required fields are filled
      if (!facilityType || !facilityName || !image || !title || !details) {
        console.error("Please fill in all the fields");
        return;
      }

      // Upload image to storage
      const imageRef = storageRef(
        storage,
        `reportImages/${facilityType}/${image.name}`
      );
      await uploadBytes(imageRef, image);

      const imageUrl = await getDownloadURL(imageRef);

      // Add report data to Realtime Database
      const db = getDatabase();
      const reportsRef = ref(db, `users/${userId}/reports`);
      const newReportRef = push(reportsRef);
      await set(newReportRef, {
        facilityType,
        facilityName,
        imageUrl: imageUrl,
        title,
        details,
        timestamp: new Date().toISOString(),
        status: "Submitted",
      });

      // Clear form fields after submission
      setFacilityType("");
      setFacilityName("");
      setImage(null);
      setTitle("");
      setDetails("");

      console.log("Report added successfully!");
    } catch (error) {
      console.error("Error adding report:", error);
    }
  };

  return (
    <Container className="mt-3">
      <h2>Add Report</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Facility Type</Form.Label>
          <Form.Select onChange={handleFacilityTypeChange} value={facilityType}>
            <option value="" disabled>
              Select Facility Type
            </option>
            <option value="lab">Lab</option>
            <option value="class">Class</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Facility Name</Form.Label>
          <Form.Select onChange={handleFacilityNameChange} value={facilityName}>
            <option value="" disabled>
              Select Facility Name
            </option>
            {(facilityType === "lab" ? labs : classes)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((facility, index) => (
                <option key={index} value={facility.name}>
                  {facility.name}
                </option>
              ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={handleTitleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Details</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={details}
            onChange={handleDetailsChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="flex-end">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default AddReport;
