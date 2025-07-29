// src/components/DashboardExecutive/DashboardExecutive.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Add this
import { MdDirectionsCar } from 'react-icons/md';
import './DashboardExecutive.css';

const DashboardExecutive = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allCars, setAllCars] = useState([]);
  const navigate = useNavigate(); // ✅ Required to navigate on car click

  const stats = {
    carsAdded: allCars.length,
    pendingKYC: 5,
    deliveriesUpdated: 8,
  };

  useEffect(() => {
    const storedCars = JSON.parse(localStorage.getItem('cars')) || [];
    setAllCars(storedCars);
  }, []);

  const filteredCars = allCars.filter((car) =>
    car.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.engineNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.carName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-executive">
      {/* Top Bar */}
      <div className="dashboard-topbar">
        <div className="dashboard-header">
          <h2><span className="brand text-gold"> <MdDirectionsCar /></span> Executive Dashboard</h2>
          <p>Welcome back! Here's your live update.</p>
        </div>
        <div className="user-profile">
          <div className="user-avatar">AS</div>
          <div className="user-info">
            <span className="user-name">Aniket Sangale</span>
            <span className="user-role">Executive</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-box">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.carsAdded}</h3>
            <span>Cars Added</span>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.pendingKYC}</h3>
            <span>Pending KYC</span>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <h3>{stats.deliveriesUpdated}</h3>
            <span>Deliveries Updated</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="dashboard-controls">
        <div className="dashboard-search">
          <input
            type="text"
            placeholder="Search by Chassis, Engine, or Car Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <button
          className="add-car-button"
          onClick={() => (window.location.href = '/executive/add-car')}
        >
          <span>+</span> Add New Car
        </button>
      </div>

      {/* Car Inventory */}
      <div className="dashboard-cars">
        <h3 className="cars-header">Inventory Overview</h3>
        {filteredCars.length > 0 ? (
          <div className="car-grid">
            {filteredCars.map((car) => (
              <div
                className="car-card"
                key={car.id}
                onClick={() => navigate(`/executive/car/${car.id}`)} // ✅ Clicking goes to detailed page
                style={{ cursor: 'pointer' }}
              >
                <div className="car-image">
                  {car.photos && car.photos.length > 0 ? (
                    <img
                      src={car.photos[0]}
                      alt={`Car ${car.carName}`}
                      className="car-photo"
                    />
                  ) : (
                    <p style={{ color: '#ccc', padding: '20px' }}>No Image Aniekt Test</p>
                  )}
                </div>
                <div className="car-details">
                  <h4>{car.carName}</h4>
                  <div className="car-specs">
                    <p><span>Chassis:</span> {car.chassisNumber}</p>
                    <p><span>Engine:</span> {car.engineNumber}</p>
                    <p><span>Color:</span> {car.color}</p>
                  </div>
                  <div className="car-status in-stock">In Stock</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🚫</div>
            <p>No cars found for that search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardExecutive;
