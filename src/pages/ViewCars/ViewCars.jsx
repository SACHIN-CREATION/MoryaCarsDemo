import React, { useEffect, useState } from 'react';
import './ViewCars.css';
import { useNavigate } from 'react-router-dom'; 

function ViewCars() {
  const [carList, setCarList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedCars = JSON.parse(localStorage.getItem('cars')) || [];
    setCarList(storedCars);
  }, []);

  

    const filteredCarList = carList.filter((car) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (car.carName?.toLowerCase().includes(q)) ||
      (car.chassisNumber?.toLowerCase().includes(q)) ||
      (car.engineNumber?.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <div className="dashboard-cars m-2 ">
        <h3 className="cars-header">All cars</h3>

        {/* Search input (optional UI if you want to add search box) */}
         <input
        type="text"
        placeholder="Search by Car Name, Chassis or Engine Number"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-100 mt-2 mb-4 "
      />

        {filteredCarList.length > 0 ? (
          <div className="car-grid">
            {filteredCarList.map((car) => (
              <div
                className="car-card"
                key={car.id}
                onClick={() => navigate(`/executive/car/${car.id}`)}
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
                    <p style={{ color: '#ccc', padding: '20px' }}>No Image Available</p>
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
    </>
  );
}

export default ViewCars;







