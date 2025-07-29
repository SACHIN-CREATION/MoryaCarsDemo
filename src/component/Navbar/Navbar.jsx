import React from 'react';
import { FaCar } from 'react-icons/fa'; // Install react-icons if not already done
 import { MdDirectionsCar } from 'react-icons/md';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4">
    <div className="d-flex align-items-center gap-3">
      {/* <span className="fs-2 text-warning"><FaCar /></span> */}
      <span className="brand text-gold"><MdDirectionsCar /></span>
      <span className="navbar-brand mb-0 h1 fw-bold" style={{ letterSpacing: '1px' }}>
        Morya Cars
      </span>
    </div>
  </nav>
);

export default Navbar;

