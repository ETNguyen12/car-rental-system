import { useState, useEffect } from "react";
import api from '../../services/api'; // Axios instance with base URL

function EmployeeMain() {
  const [rentals, setRentals] = useState([]);
  const [selectedRental, setSelectedRental] = useState(null);

  // Fetch Rentals Data
  const fetchRentals = async () => {
    try {
      const response = await api.get("/employee/rentals");
      setRentals(response.data);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchRentals();
  }, []);

  // Format date range for MM/DD - MM/DD/YY or MM/DD/YY - MM/DD/YY
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startMonth = (start.getMonth() + 1).toString().padStart(2, "0");
    const startDay = start.getDate().toString().padStart(2, "0");
    const startYear = start.getFullYear().toString().slice(-2);

    const endMonth = (end.getMonth() + 1).toString().padStart(2, "0");
    const endDay = end.getDate().toString().padStart(2, "0");
    const endYear = end.getFullYear().toString().slice(-2);

    if (start.getFullYear() === end.getFullYear()) {
      return `${startMonth}/${startDay} - ${endMonth}/${endDay}/${endYear}`;
    }
    return `${startMonth}/${startDay}/${startYear} - ${endMonth}/${endDay}/${endYear}`;
  };

  // Format customer name as First Name and Last Initial
  const formatCustomerName = (fullName) => {
    const [firstName, lastName] = fullName.split(" ");
    return `${firstName} ${lastName?.[0] || ""}.`;
  };

  return (
    <div className="container-fluid bg-light py-4" style={{ display: "flex", height: "100vh" }}>
      {/* Side Navbar */}
      <div
        className="bg-white shadow-sm"
        style={{ width: "15%", minWidth: "150px" }} // Reduced width for the navbar
      >
        <h4 className="p-3 border-bottom">Tables</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <button className="btn btn-link nav-link active" onClick={fetchRentals}>
              Rentals
            </button>
          </li>
          <li className="nav-item">
            <button className="btn btn-link nav-link">Users</button>
          </li>
          <li className="nav-item">
            <button className="btn btn-link nav-link">Vehicles</button>
          </li>
          <li className="nav-item">
            <button className="btn btn-link nav-link">Rental Fees</button>
          </li>
        </ul>
      </div>

      {/* Middle Panel (Rentals List) */}
      <div className="bg-light" style={{ width: "45%", overflowY: "auto" }}>
        <h4 className="p-3 border-bottom">Rentals</h4>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{ width: "30%" }}>Customer</th>
                <th style={{ width: "25%" }}>Vehicle</th>
                <th style={{ width: "35%" }}>Date Range</th>
                <th style={{ width: "10%" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr
                  key={rental.id}
                  onClick={() => setSelectedRental(rental)} // Set selected rental
                  className={selectedRental?.id === rental.id ? "table-primary" : ""}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <td>{formatCustomerName(rental.customer_name)}</td>
                  <td>{rental.vehicle}</td>
                  <td>{formatDateRange(rental.pickup_date, rental.dropoff_date)}</td>
                  <td>
                    <span
                      className={`badge ${
                        rental.status === "Pending Payment"
                          ? "bg-warning text-dark"
                          : rental.status === "Ongoing"
                          ? "bg-success"
                          : rental.status === "Completed"
                          ? "bg-secondary"
                          : "bg-danger"
                      }`}
                    >
                      {rental.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Panel (Rental Details) */}
      <div className="bg-white shadow-sm" style={{ width: "40%", padding: "1.5rem", overflowY: "auto" }}>
        {selectedRental ? (
          <div>
            <h4 className="mb-4 border-bottom pb-2 text-center">Rental Details</h4>
            <div className="mb-3">
              <h6 className="text-primary">Customer Information</h6>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td><strong>Name:</strong></td>
                    <td>{selectedRental.customer_name}</td>
                  </tr>
                  <tr>
                    <td><strong>Email:</strong></td>
                    <td>{selectedRental.email || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Phone:</strong></td>
                    <td>{selectedRental.phone_number || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mb-3">
              <h6 className="text-primary">Rental Information</h6>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td><strong>Date Range:</strong></td>
                    <td>{formatDateRange(selectedRental.pickup_date, selectedRental.dropoff_date)}</td>
                  </tr>
                  <tr>
                    <td><strong>Daily Rate:</strong></td>
                    <td>${selectedRental.daily_rate || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Status:</strong></td>
                    <td>
                      <span
                        className={`badge ${
                          selectedRental.status === "Pending Payment"
                            ? "bg-warning text-dark"
                            : selectedRental.status === "Ongoing"
                            ? "bg-success"
                            : selectedRental.status === "Completed"
                            ? "bg-secondary"
                            : "bg-danger"
                        }`}
                      >
                        {selectedRental.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mb-3">
              <h6 className="text-primary">Vehicle Information</h6>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td><strong>Model:</strong></td>
                    <td>{selectedRental.vehicle}</td>
                  </tr>
                  <tr>
                    <td><strong>VIN:</strong></td>
                    <td>{selectedRental.vin || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-center">Select a rental to see details.</p>
        )}
      </div>
    </div>
  );
}

export default EmployeeMain;
