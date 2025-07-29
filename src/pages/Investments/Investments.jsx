
// src/pages/Investment/Investment.jsx
import React, { useState } from "react";
import "./Investments.css";

const Investment = () => {
  const [expenses, setExpenses] = useState([
    { type: "", amount: "", date: "", description: "" },
  ]);
  const [selectedCar, setSelectedCar] = useState("");

  const expenseTypes = ["Repainting", "Battery", "Tyres", "Maintenance", "Other"];

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  const addExpenseRow = () => {
    setExpenses([...expenses, { type: "", amount: "", date: "", description: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Car:", selectedCar);
    console.log("Expenses:", expenses);
    // Here you'd typically send the data to your backend
  };

  return (
    <div className="investment-page">
      <h2 className="investment-title">Add Investment Against Car</h2>

      <form className="investment-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="carSelect">Select Car:</label>
          <select
            id="carSelect"
            className="investment-car-dropdown"
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
          >
            <option value="">-- Select Car --</option>
            <option value="car1">Toyota Innova</option>
            <option value="car2">Hyundai Creta</option>
            <option value="car3">Maruti Swift</option>
            {/* You can dynamically load cars from backend */}
          </select>
        </div>

        <h3 className="expense-section-title">Expense Details</h3>

        {expenses.map((expense, index) => (
          <div className="expense-row" key={index}>
            <select
              className="expense-type"
              value={expense.type}
              onChange={(e) => handleExpenseChange(index, "type", e.target.value)}
            >
              <option value="">-- Expense Type --</option>
              {expenseTypes.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="expense-amount"
              placeholder="Amount"
              value={expense.amount}
              onChange={(e) => handleExpenseChange(index, "amount", e.target.value)}
            />

            <input
              type="date"
              className="expense-date"
              value={expense.date}
              onChange={(e) => handleExpenseChange(index, "date", e.target.value)}
            />

            <textarea
              className="expense-description"
              placeholder="Description"
              value={expense.description}
              onChange={(e) => handleExpenseChange(index, "description", e.target.value)}
            />
          </div>
        ))}

        <button type="button" className="add-expense-btn" onClick={addExpenseRow}>
          + Add Expense Row
        </button>

        <button type="submit" className="submit-investment-btn">
          Submit Investment
        </button>
      </form>
    </div>
  );
};

export default Investment;









// import React, { } from "react";
// import "../Investments/Investments";

//  const expenseTypes = ["Repainting", "Battery", "Tyres", "Maintenance", "Other"];

//     const Investment = () => {
//       const [cars, setCars] = React.useState([]);
//       const [selectedCarId, setSelectedCarId] = React.useState("");
//       const [selectedCar, setSelectedCar] = React.useState(null);
//       const [expenses, setExpenses] = React.useState([]);
//       const [newExpense, setNewExpense] = React.useState({ type: "", amount: "", date: "", description: "" });
//       const [finalSellPrice, setFinalSellPrice] = React.useState("");
//       const [profitMargin, setProfitMargin] = React.useState(0);

//       // Fetch cars from localStorage
//       React.useEffect(() => {
//         const storedCars = JSON.parse(localStorage.getItem("cars")) || [];
//         setCars(storedCars);
//       }, []);

//       // Load selected car data and expenses
//       React.useEffect(() => {
//         if (!selectedCarId) {
//           setSelectedCar(null);
//           setExpenses([]);
//           setFinalSellPrice("");
//           setProfitMargin(0);
//           return;
//         }
//         const car = cars.find((c) => String(c.id) === selectedCarId);
//         if (car) {
//           setSelectedCar(car);
//           setExpenses(car.expenditures || []);
//           setFinalSellPrice(car.sellPrice?.toString() ?? "");
//           setProfitMargin(car.profitMargin ?? 0);
//         }
//       }, [selectedCarId, cars]);

//       // Update localStorage with car data
//       const updateCarData = (updatedFields) => {
//         const updatedCars = cars.map((car) =>
//           String(car.id) === selectedCarId ? { ...car, ...updatedFields } : car
//         );
//         setCars(updatedCars);
//         localStorage.setItem("cars", JSON.stringify(updatedCars));
//       };

//       // Handle adding a new expense
//       const handleAddExpenseRow = () => {
//         const amount = Number(newExpense.amount);
//         if (!newExpense.type || isNaN(amount) || amount <= 0) {
//           alert("Please select an expense type and enter a positive amount.");
//           return;
//         }
//         const updatedExpenses = [...expenses, { ...newExpense, amount }];
//         setExpenses(updatedExpenses);
//         updateCarData({ expenditures: updatedExpenses });
//         setNewExpense({ type: "", amount: "", date: "", description: "" });

//         // Update final sell price based on profit margin
//         if (selectedCar) {
//           const basePrice = Number(selectedCar.price) || 0;
//           const totalExpenses = updatedExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);
//           const minPrice = basePrice + totalExpenses;
//           const priceWithProfit = minPrice * (1 + profitMargin / 100);
//           setFinalSellPrice(priceWithProfit.toFixed(2));
//           updateCarData({ sellPrice: priceWithProfit });
//         }
//       };

//       // Handle removing an expense
//       const handleRemoveExpense = (index) => {
//         const updatedExpenses = expenses.filter((_, i) => i !== index);
//         setExpenses(updatedExpenses);
//         updateCarData({ expenditures: updatedExpenses });

//         // Recalculate final sell price
//         if (selectedCar) {
//           const basePrice = Number(selectedCar.price) || 0;
//           const totalExpenses = updatedExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);
//           const priceWithProfit = (basePrice + totalExpenses) * (1 + profitMargin / 100);
//           setFinalSellPrice(priceWithProfit.toFixed(2));
//           updateCarData({ sellPrice: priceWithProfit });
//         }
//       };

//       // Handle final sell price change
//       const onFinalSellPriceChange = (value) => {
//         const val = value ? Number(value) : "";
//         setFinalSellPrice(value);
//         if (!isNaN(val) && val >= 0 && selectedCar) {
//           updateCarData({ sellPrice: val });
//         }
//       };

//       // Handle profit margin change
//       const onProfitMarginChange = (value) => {
//         const val = value ? Number(value) : 0;
//         if (isNaN(val) || val < 0 || val > 100) {
//           alert("Profit margin must be between 0 and 100.");
//           return;
//         }
//         setProfitMargin(val);
//         if (selectedCar) {
//           updateCarData({ profitMargin: val });
//           const basePrice = Number(selectedCar.price) || 0;
//           const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
//           const priceWithProfit = (basePrice + totalExpenses) * (1 + val / 100);
//           setFinalSellPrice(priceWithProfit.toFixed(2));
//           updateCarData({ sellPrice: priceWithProfit });
//         }
//       };

//       // Handle investment submission
//       const handleSubmit = () => {
//         if (!selectedCar) {
//           alert("Please select a car first.");
//           return;
//         }
//         alert("Investments updated successfully!");
//       };

//       // Calculations
//       const basePrice = selectedCar ? Number(selectedCar.price) || 0 : 0;
//       const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
//       const totalCost = basePrice + totalExpenses;
//       const minSellPrice = totalCost * (1 + profitMargin / 100);
//       const currentSellPrice = Number(finalSellPrice) || 0;
//       const profit = currentSellPrice - totalCost;

//       return (
//         <div className="container mx-auto my-5 p-4 max-w-4xl">
//           <h2 className="text-2xl font-bold text-yellow-600 mb-6">Add / Manage Investment For Cars</h2>

//           <div className="mb-6">
//             <label htmlFor="carSelect" className="block text-sm font-medium text-gray-700 mb-2">Select Car</label>
//             <select
//               id="carSelect"
//               className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
//               value={selectedCarId}
//               onChange={(e) => setSelectedCarId(e.target.value)}
//             >
//               <option value="">-- Select Car --</option>
//               {cars.map((car) => (
//                 <option key={car.id} value={car.id}>
//                   {car.carName || `Car #${car.id}`} (₹{Number(car.price || 0).toLocaleString()})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {selectedCar && (
//             <>
//               <div className="mb-6 bg-yellow-50 p-4 rounded-lg shadow-sm">
//                 <h4 className="text-lg font-semibold text-yellow-600 mb-3">Car Summary</h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                   <div><strong>Brand:</strong> {selectedCar.brand}</div>
//                   <div><strong>Model:</strong> {selectedCar.model}</div>
//                   <div><strong>Chassis No:</strong> {selectedCar.chassisNumber}</div>
//                   <div><strong>Engine No:</strong> {selectedCar.engineNumber}</div>
//                   <div><strong>Color:</strong> {selectedCar.color}</div>
//                   <div><strong>Year:</strong> {selectedCar.year}</div>
//                   <div><strong>Purchase Price:</strong> ₹{basePrice.toLocaleString()}</div>
//                   <div><strong>Total Expenses:</strong> ₹{totalExpenses.toLocaleString()}</div>
//                   <div><strong>Total Cost:</strong> ₹{totalCost.toLocaleString()}</div>
//                   <div className={profit >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
//                     <strong>Estimated Profit:</strong> ₹{profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-lg shadow-sm">
//                 <h3 className="text-xl font-semibold text-yellow-600 mb-4">Investment & Expense Details</h3>

//                 {expenses.map((expense, idx) => (
//                   <div key={idx} className="flex flex-col sm:flex-row gap-3 mb-3 items-center">
//                     <select
//                       className="w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
//                       value={expense.type}
//                       onChange={(e) => {
//                         const updated = [...expenses];
//                         updated[idx].type = e.target.value;
//                         setExpenses(updated);
//                         updateCarData({ expenditures: updated });
//                       }}
//                       required
//                     >
//                       <option value="">Select Expense Type</option>
//                       {expenseTypes.map((type, i) => (
//                         <option key={i} value={type}>{type}</option>
//                       ))}
//                     </select>

//                     <input
//                       type="number"
//                       className="w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
//                       min="0"
//                       step="0.01"
//                       placeholder="Amount"
//                       value={expense.amount}
//                       onChange={(e) => {
//                         const val = e.target.value;
//                         if (val === "" || (Number(val) >= 0 && !isNaN(val))) {
//                           const updated = [...expenses];
//                           updated[idx].amount = val;
//                           setExpenses(updated);
//                           updateCarData({ expenditures: updated });
//                         }
//                       }}
//                       required
//                     />

//                     <input
//                       type="date"
//                       className="w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
//                       value={expense.date}
//                       onChange={(e) => {
//                         const updated = [...expenses];
//                         updated[idx].date = e.target.value;
//                         setExpenses(updated);
//                         updateCarData({ expenditures: updated });
//                       }}
//                       required
//                     />

//                     <input
//                       type="text"
//                       className="w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
//                       placeholder="Description"
//                       value={expense.description}
//                       onChange={(e) => {
//                         const updated = [...expenses];
//                         updated[idx].description = e.target.value;
//                         setExpenses(updated);
//                         updateCarData({ expenditures: updated });
//                       }}
//                     />

//                     <button
//                       type="button"
//                       className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
//                       onClick={() => handleRemoveExpense(idx)}
//                       title="Remove Expense"
//                     >
//                       &times;
//                     </button>
//                   </div>
//                 ))}

//                 <div className="flex flex-col sm:flex-row gap-3 mt-4">
//                   <select
//                     className="w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
//                     value={newExpense.type}
//                     onChange={(e) => setNewExpense((prev) => ({ ...prev, type: e.target.value }))}
//                   >
//                     <option value="">Select Expense Type</option>
//                     {expenseTypes.map((type, i) => (
//                       <option key={i} value={type}>{type}</option>
//                     ))}
//                   </select>
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     className="w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
//                     placeholder="Amount"
//                     value={newExpense.amount}
//                     onChange={(e) => {
//                       const val = e.target.value;
//                       if (val === "" || (Number(val) >= 0 && !isNaN(val))) {
//                         setNewExpense((prev) => ({ ...prev, amount: val }));
//                       }
//                     }}
//                   />
//                   <input
//                     type="date"
//                     className="w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
//                     value={newExpense.date}
//                     onChange={(e) => setNewExpense((prev) => ({ ...prev, date: e.target.value }))}
//                   />
//                   <input
//                     type="text"
//                     className="w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
//                     placeholder="Description"
//                     value={newExpense.description}
//                     onChange={(e) => setNewExpense((prev) => ({ ...prev, description: e.target.value }))}
//                   />
//                   <button
//                     type="button"
//                     className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//                     onClick={handleAddExpenseRow}
//                     title="Add Expense"
//                   >
//                     + Add
//                   </button>
//                 </div>

//                 <div className="mt-6">
//                   <label htmlFor="finalSellPrice" className="block text-sm font-medium text-yellow-600 mb-2">
//                     Final Selling Price (₹)
//                   </label>
//                   <input
//                     id="finalSellPrice"
//                     type="number"
//                     className="w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
//                     min={minSellPrice}
//                     step="0.01"
//                     value={finalSellPrice}
//                     onChange={(e) => onFinalSellPriceChange(e.target.value)}
//                   />
//                   {finalSellPrice && Number(finalSellPrice) < minSellPrice && (
//                     <p className="text-red-500 text-sm mt-1">
//                       Selling price should be at least ₹{minSellPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} to cover cost and profit margin.
//                     </p>
//                   )}
//                 </div>

//                 <div className="mt-4">
//                   <label htmlFor="profitMargin" className="block text-sm font-medium text-yellow-600 mb-2">
//                     Profit Margin (%)
//                   </label>
//                   <input
//                     id="profitMargin"
//                     type="number"
//                     className="w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
//                     min="0"
//                     max="100"
//                     step="0.1"
//                     value={profitMargin}
//                     onChange={(e) => onProfitMarginChange(e.target.value)}
//                   />
//                 </div>

//                 <button
//                   type="button"
//                   className="mt-6 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
//                   onClick={handleSubmit}
//                 >
//                   Submit Investment
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       );
//     };

// export default Investment;
