import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaCar, FaUser, FaFileAlt, FaTimes } from 'react-icons/fa';
import { MdDirectionsCar } from 'react-icons/md';


import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  // New state for hover toggle
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = role === 'admin'
    ? [
        { path: '/admin/dashboard', icon: <FaHome />, label: 'Dashboard' },
        { path: '/admin/view-cars', icon: <FaCar />, label: 'View Cars' },
        { path: '/admin/investments', icon: <FaFileAlt />, label: 'Investments' },
        { path: '/admin/reports', icon: <FaFileAlt />, label: 'Reports' }
      ]
    : [
        { path: '/executive/dashboard', icon: <FaHome />, label: 'Dashboard' },
        { path: '/executive/add-car', icon: <FaCar />, label: 'Add Car' },
        { path: '/executive/view-cars', icon: <FaCar />, label: 'View Cars' },
        { path: '/executive/kyc-upload', icon: <FaUser />, label: 'Buyer KYC' },
        { path: '/executive/kyc-seller', icon: <FaUser />, label: 'Seller KYC' }
      ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <aside
      className={`sidebar ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="sidebar-header" >
        {/* <span className="brand">🚗</span> */}
                <span className="brand text-gold"><MdDirectionsCar /></span>
        {isExpanded && <span className="brand-label">Morya Cars</span>}
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ path, icon, label }) => (
          <NavLink
            to={path}
            key={path}
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            <div className="icon">{icon}</div>
            {isExpanded && <span className="label">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          {isExpanded ? 'Logout' : <FaTimes />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

