// src/components/Layout/Layout.jsx
import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import './Layout.css';

const Layout = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`layout ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div className="main-content">
        <Navbar />
        <div className="page-conten t">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
