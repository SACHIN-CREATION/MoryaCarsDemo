import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../CarDetails/CarDetails.css";

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [expenditures, setExpenditures] = useState([]);
  const [newExpenditure, setNewExpenditure] = useState({
    type: "",
    amount: "",
  });
  const [sellPrice, setSellPrice] = useState("");
  const [profitMargin, setProfitMargin] = useState(20);

  // On mount/load
  useEffect(() => {
    const cars = JSON.parse(localStorage.getItem("cars")) || [];
    const numericId = Number(id);
    const selectedCar = cars.find((c) => c.id === numericId);
    if (selectedCar) {
      setCar(selectedCar);
      
      // Expecting expenditures as array of {type, amount}
      setExpenditures(selectedCar.expenditures || []);
      const initialSellPrice =
        selectedCar.sellPrice ||
        (        
          parseFloat(selectedCar.price || 0) *
          (1 + (selectedCar.profitMargin ?? 20) / 100)
        ).toFixed(2);
      setSellPrice(initialSellPrice);
      setProfitMargin(selectedCar.profitMargin ?? 20);
      if (!selectedCar.sellPrice) {
        updateCar({ sellPrice: parseFloat(initialSellPrice) });
      }
    } else {
      setCar(null);
    }
    // eslint-disable-next-line
  }, [id]);

  // Update car in local storage
  const updateCar = (updatedFields) => {
    const cars = JSON.parse(localStorage.getItem("cars")) || [];
    const updatedCars = cars.map((c) => {
      if (c.id === Number(id)) {
        const updatedCar = {
          ...c,
          ...updatedFields,
          expenditures: updatedFields.expenditures ?? expenditures,
          sellPrice: updatedFields.sellPrice ?? parseFloat(sellPrice),
          profitMargin: updatedFields.profitMargin ?? profitMargin,
        };
        setCar(updatedCar);
        return updatedCar;
      }
      return c;
    });
    localStorage.setItem("cars", JSON.stringify(updatedCars));
  };

  // --- Expenditure Form Handlers ---

  // Add expenditure to the list
  const handleAddExpenditure = () => {
    if (
      !newExpenditure.type ||
      !newExpenditure.amount ||
      isNaN(newExpenditure.amount) ||
      Number(newExpenditure.amount) <= 0
    )
      return alert("Enter a valid description and amount!");
    const entry = {
      type: newExpenditure.type,
      amount: Number(newExpenditure.amount),
    };
    const updated = [...expenditures, entry];
    setExpenditures(updated);
    updateCar({ expenditures: updated });
    // Recalculate sell price with profit margin
    const newTotalCost =
      parseFloat(car?.price || 0) +
      updated.reduce((a, b) => a + (b.amount || 0), 0);
    const newSellPrice = (newTotalCost * (1 + profitMargin / 100)).toFixed(2);
    setSellPrice(newSellPrice);
    updateCar({ sellPrice: parseFloat(newSellPrice) });
    setNewExpenditure({ type: "", amount: "" });
  };

  // Remove an expenditure entry (optional)
  const handleRemoveExpenditure = (index) => {
    const updated = expenditures.filter((_, idx) => idx !== index);
    setExpenditures(updated);
    updateCar({ expenditures: updated });
  };
  // --- Calculations ---
  const totalExpenditures = expenditures.reduce(
    (a, b) => a + (b.amount || 0),
    0
  );
  const purchasePrice = parseFloat(car?.price || 0);
  const totalCost = purchasePrice + totalExpenditures;

  if (!car)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Car not found.</div>
      </div>
    );

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">{car.carName || "Car"} - Details</h2>
        </div>
        <div className="card-body">
          {/* Images */}
          <div className="row mb-4">
            <div className="col-12">
              <h5 className="mb-3">Car Photos</h5>
              <div className="car-photos-scroll">
                {car.photos && car.photos.length > 0 ? (
                  car.photos.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Car ${idx}`}
                      className="img-thumbnail"
                      style={{
                        maxWidth: "170px",
                        maxHeight: "130px",
                        minWidth: "120px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(212,175,55,0.15)",
                        background: "#faf5e6",
                      }}
                    />
                  ))
                ) : (
                  <span className="text-muted">No Images Available</span>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <div className="card bg-light">
                <div className="card-body">
                  <h5 className="card-title mb-3">Basic Information</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Brand:</strong> <span>{car.Brand || "N/A"}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Model:</strong> <span>{car.Model || "N/A"}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Chassis No:</strong> <span>{car.chassisNumber}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Engine No:</strong> <span>{car.engineNumber}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Color:</strong> <span>{car.color}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Year:</strong> <span>{car.year || "N/A"}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>KM Driven:</strong> <span>{car.KMDriven || "N/A"}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Fuel Type:</strong> <span>{car.FuelType || "N/A"}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Transmission:</strong> <span>{car.transmission || "N/A"}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Purchase Price:</strong> <span>₹{purchasePrice.toFixed(2)}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Expenditure & sell summary */}
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Add Expenditure / Work</h5>
                  {/* Expenditure Input Form - Mobile Optimized */}
                  <div className="mb-3">
                    <div className="row g-2">
                      <div className="col-12">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Expenditure Item e.g. Tyre Change"
                          value={newExpenditure.type}
                          onChange={(e) =>
                            setNewExpenditure({
                              ...newExpenditure,
                              type: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-8 col-sm-9">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Amount (₹)"
                          min={0}
                          value={newExpenditure.amount}
                          onChange={(e) =>
                            setNewExpenditure({
                              ...newExpenditure,
                              amount: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-4 col-sm-3">
                        <button
                          className="btn btn-outline-primary w-100"
                          onClick={handleAddExpenditure}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>                 

                  <div className="expenditure-list-scroll">
                    <ul className="list-group mb-2">
                      {expenditures.length > 0 ? (
                        expenditures.map((e, i) => (
                          <li
                            key={i}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <div className="flex-grow-1">
                              <div className="fw-medium">{e.type}</div>
                              <small className="text-muted">₹{e.amount.toFixed(2)}</small>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger ms-2"
                              onClick={() => handleRemoveExpenditure(i)}
                            >
                              ✕
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item text-muted text-center">
                          No expenditures added.
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sell Details summary */}
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Cost Summary</h5>
                  <div className="row g-2">
                    <div className="col-12">
                      <div className="d-flex justify-content-between py-2 border-bottom">
                        <strong>Purchase Price:</strong>
                        <span>₹{purchasePrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex justify-content-between py-2 border-bottom">
                        <strong>Total Expenditures:</strong>
                        <span>₹{totalExpenditures.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex justify-content-between py-2 bg-light rounded px-2">
                        <strong>Total Cost:</strong>
                        <strong className="text-primary">₹{totalCost.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End main row */}
        </div>
      </div>
    </div>
  );
};

export default CarDetails;