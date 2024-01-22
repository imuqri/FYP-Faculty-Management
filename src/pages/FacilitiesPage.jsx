import React, { useState } from "react";
import { Container } from "react-bootstrap";
import DisplayFacility from "../components/DisplayFacility";

const FacilitiesPage = () => {
  return (
    <Container className="mt-3">
      <DisplayFacility />
    </Container>
  );
};

export default FacilitiesPage;
