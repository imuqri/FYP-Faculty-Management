import React from "react";
import { Link } from "react-router-dom";

const Main = () => {
  return (
    <div className="mb-5">
      <h1 className="text-center mt-5 mb-5">
        WELCOME TO FACULTY MANAGEMENT SYSTEM
      </h1>
      <div className="d-flex justify-content-center">
        <div className="d-flex justify-content-between">
          <Link
            to="/My-report"
            className="btn btn-primary btn-lg rounded flex-fill me-2"
          >
            E-REPORT
          </Link>
          <Link
            to="/Facilities"
            className="btn btn-primary btn-lg rounded flex-fill ms-2"
          >
            FACILITIES
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Main;
