import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav id="sidebar" className="bg-light">
      <div className="p-4">
        <h4>App Name</h4>
        <ul className="list-unstyled components">
          <li>
            <Link to="/account">Account</Link>
          </li>
          <li>
            <Link to="/addUser">Add User</Link>
          </li>
          <li>
            <Link to="/addSoftware">Add Software</Link>
          </li>
          {/* Add more links as needed */}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
