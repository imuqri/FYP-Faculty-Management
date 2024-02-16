import React, { useState } from "react";
import { Container } from "react-bootstrap";
import DisplayAllReports from "../components/DisplayAllReport";

const FacilitiesReportsPage = () => {
  return (
    <Container className="mt-3">
      <DisplayAllReports />
    </Container>
  );
};

export default FacilitiesReportsPage;
