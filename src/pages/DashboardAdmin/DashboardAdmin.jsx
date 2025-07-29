import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCar,
  FaCheckCircle,
  FaBox,
  FaLock,
  FaFileAlt,
  FaUser,
} from "react-icons/fa";
import '../DashboardAdmin/DashboardAdmin.css'


const DashboardAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allCars, setAllCars] = useState([]);
  const selectedFilter = 'all';
  const [showReports, setShowReports] = useState(false);
  const navigate = useNavigate();

  // Stats calculation
  const getCarStats = () => {
    const totalCars = allCars.length;
    const soldCars = allCars.filter((car) => car.status === "sold").length;
    const inStockCars = allCars.filter(
      (car) => car.status === "in-stock" || !car.status
    ).length;
    const reservedCars = allCars.filter(
      (car) => car.status === "reserved"
    ).length;
    const totalInvestments = allCars.reduce(
      (sum, car) => sum + (car.price || 50000),
      0
    );
    const pendingKYC = 15;

    return {
      totalCars,
      soldCars,
      inStockCars,
      reservedCars,
      totalInvestments,
      pendingKYC,
      totalExecutives: 12,
      totalDeliveries: 37,
    };
  };

  const stats = getCarStats();

  useEffect(() => {
    const storedCars = JSON.parse(localStorage.getItem("cars")) || [];
    const carsWithStatus = storedCars.map((car) => ({
      ...car,
      status: car.status || "in-stock",
      price: car.price || Math.floor(Math.random() * 100000) + 30000,
      kycStatus:
        car.kycStatus || (Math.random() > 0.7 ? "pending" : "approved"),
    }));
    setAllCars(carsWithStatus);
  }, []);

  const filteredCars = allCars.filter((car) => {
    const matchesSearch =
      car.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.engineNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.carName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || car.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "sold":
        return "#e74c3c"; // red
      case "reserved":
        return "#f39c12"; // orange
      case "in-stock":
        return "#2ecc71"; // green
      default:
        return "#2ecc71";
    }
  };

  const generateSummaryReport = () => {
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
    });
    return {
      period: `${currentMonth} 2025`,
      revenue: stats.soldCars * 45000,
      profit: stats.soldCars * 8000,
      topPerformer: "Executive John Doe",
      conversionRate: ((stats.soldCars / stats.totalCars) * 100).toFixed(1),
    };
  };



  // Smaller helper components for stats and report cards

const StatBox = ({ icon, value, label }) => (
  <div className="admin-stat-box col-md d-flex gap-3 p-4 rounded-4 bg-cream-light shadow-sm align-items-center">
    <div className="admin-stat-icon fs-2 text-gold">{icon}</div>
    <div className="admin-stat-content">
      <h3 className="fs-2 text-gold mb-1">{value}</h3>
      <span className="text-muted fw-semibold">{label}</span>
    </div>
  </div>
);

const ReportCard = ({ title, data }) => (
  <div className="admin-report-card p-3 rounded-3 shadow-sm bg-white">
    <h4 className="text-gold fw-semibold mb-3">{title}</h4>
    <div className="admin-report-stats fs-6">
      {data.map(({ label, value }) => (
        <p
          key={label}
          className="d-flex justify-content-between border-bottom border-2 border-light-subtle py-1"
        >
          <span className="text-muted">{label}</span>
          <span className="fw-semibold text-dark">{value}</span>
        </p>
      ))}
    </div>
  </div>
);

  return (
    <div className="dashboard-admin bg-cream-light min-vh-100 p-4">
      {/* Top Bar */}
      <div className="admin-topbar d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4 border-bottom border-gold">
        <div className="admin-header">
          <h2 className="display-5 fw-bold creamy-gradient-text mb-1">
            🛠️ Admin Dashboard
          </h2>
          <p className="text-muted mb-0">
            Manage all system activities from here.
          </p>
        </div>
        <div className="admin-profile d-flex align-items-center gap-3">
          <div className="admin-avatar d-flex align-items-center justify-content-center rounded-circle bg-gold text-dark fw-bold fs-5">
            AD
          </div>
          <div className="admin-info">
            <span className="admin-name fw-semibold d-block text-dark">
              Admin User
            </span>
            <span className="admin-role text-gold fw-medium">
              Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats row g-4 mb-4">
        <StatBox
          icon={<FaCar />}
          value={stats.totalCars}
          label="Total Cars Listed"
        />
        <StatBox
          icon={<FaCheckCircle />}
          value={stats.soldCars}
          label="Cars Sold"
        />
        <StatBox icon={<FaBox />} value={stats.inStockCars} label="In Stock" />
        <StatBox
          icon={<FaLock />}
          value={stats.reservedCars}
          label="Reserved"
        />
        <StatBox
          icon={<FaCar />}
          value={`₹${(stats.totalInvestments / 100000).toFixed(1)}L`}
          label="Total Investments"
        />
        <StatBox
          icon={<FaFileAlt />}
          value={stats.pendingKYC}
          label="Pending KYC Uploads"
        />
        <StatBox
          icon={<FaUser />}
          value={stats.totalExecutives}
          label="Executives"
        />
      </div>

      {/* Reports Section */}
      <div className="admin-reports mb-4 p-3 rounded-3 bg-white shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="text-gold fw-semibold">📊 Summary Reports</h3>
          <button
            className="btn btn-outline-gold btn-sm"
            onClick={() => setShowReports(!showReports)}
          >
            {showReports ? "Hide Reports" : "Show Reports"}
          </button>
        </div>

        {showReports && (
          <div className="row g-4">
            <ReportCard
              title="Monthly Performance"
              data={[
                { label: "Period", value: generateSummaryReport().period },
                {
                  label: "Revenue",
                  value: `₹${(generateSummaryReport().revenue / 100000).toFixed(
                    1
                  )}L`,
                },
                {
                  label: "Profit",
                  value: `₹${(generateSummaryReport().profit / 100000).toFixed(
                    1
                  )}L`,
                },
                {
                  label: "Conversion Rate",
                  value: `${generateSummaryReport().conversionRate}%`,
                },
                {
                  label: "Top Performer",
                  value: generateSummaryReport().topPerformer,
                },
              ]}
            />

            <ReportCard
              title="KYC Status Overview"
              data={[
                { label: "Pending Approvals", value: stats.pendingKYC },
                {
                  label: "Completion Rate",
                  value: `${(
                    ((stats.totalCars - stats.pendingKYC) / stats.totalCars) *
                    100
                  ).toFixed(1)}%`,
                },
                {
                  label: "Action Required",
                  value: stats.pendingKYC > 10 ? "High Priority" : "Normal",
                },
              ]}
            />

            <ReportCard
              title="Inventory Analysis"
              data={[
                {
                  label: "Stock Turnover",
                  value: `${((stats.soldCars / stats.totalCars) * 100).toFixed(
                    1
                  )}%`,
                },
                { label: "Reserved Units", value: stats.reservedCars },
                { label: "Available for Sale", value: stats.inStockCars },
              ]}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="admin-controls d-flex flex-column flex-md-row align-items-center gap-3 mb-4">
        <div
          className="admin-search position-relative flex-grow-1"
          style={{ maxWidth: 500 }}
        >
          <input
            type="text"
            className="form-control rounded-pill ps-5"
            placeholder="Search car by Chassis, Engine or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="admin-search-icon">🔍</span>
        </div>
        <button
          className="btn btn-warning rounded-pill d-flex align-items-center gap-2 px-4 py-2 fw-semibold shadow-sm"
          onClick={() => navigate("/admin/add-car")}
          type="button"
        >
          <span className="fs-4">+</span> Add Car
        </button>
      </div>

      {/* Car Inventory */}
      <div>
        <h3 className="text-gold fw-semibold mb-3">
          Car Inventory ({filteredCars.length} cars)
        </h3>
        {filteredCars.length > 0 ? (
          <div className="row g-4">
            {filteredCars.map((car) => (
              <div key={car.id} className="col-12 col-sm-6 col-lg-4">
                <div 
                  className="bg-cream-light rounded-4 shadow-sm overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/admin/car/${car.id}`)}
                >
                  <div
                    className="position-relative bg-white"
                    style={{ height: 180 }}
                  >
                    {car.photos && car.photos.length > 0 ? (
                      <img
                        src={car.photos[0]}
                        alt={car.carName}
                        className="w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      <p className="text-muted text-center p-5">No Image</p>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="text-dark">{car.carName}</h4>
                    <div className="d-flex flex-wrap gap-3 fs-6 text-muted">
                      <div>
                        <strong>Chassis:</strong> {car.chassisNumber}
                      </div>
                      <div>
                        <strong>Engine:</strong> {car.engineNumber}
                      </div>
                      <div>
                        <strong>Color:</strong> {car.color}
                      </div>
                      <div>
                        <strong>Price:</strong> ₹
                        {(car.price / 100000).toFixed(1)}L
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                      <div
                        className="px-3 py-1 rounded-pill fw-semibold"                      
                        style={{
                          backgroundColor: getStatusColor(car.status) + "20", // e.g. green 20% opacity
                          color: getStatusColor(car.status),
                          border: "1px solid",
                          borderColor: getStatusColor(car.status) + "50", // e.g. green 50% opacity
                        }}
                      >
                        {car.status?.charAt(0).toUpperCase() +
                          car.status?.slice(1)}
                      </div>

                      {/* {car.kycStatus === "pending" && (
                        <div className="badge bg-warning text-dark fw-semibold">
                          KYC Pending
                        </div>
                      )} */}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/edit-car/${car.id}`);
                        }}
                        className="btn btn-outline-warning btn-sm ms-auto"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-no-results text-center p-5 rounded-3 bg-cream-light text-muted fw-semibold">
            <div className="display-3 mb-3">🚫</div>
            <p>No matching cars found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAdmin;




