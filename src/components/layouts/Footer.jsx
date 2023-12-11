// Footer.js

import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        textAlign: "center",
        width: "100%",
        bottom: 0,
        marginBottom: 10,
      }}
    >
      {/*Footer content*/}
      KPPIM Facility Management System ©{new Date().getFullYear()}
    </footer>
  );
};

export default Footer;
