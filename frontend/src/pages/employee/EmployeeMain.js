import { useState, useEffect } from "react";
import api from '../../services/api';
import Navbar from "./components/Navbar";
import RentalsTable from "./components/RentalsTable";
import RentalDetails from "./components/RentalDetails";

function EmployeeMain() {
  const [rentals, setRentals] = useState([]);
  const [selectedRental, setSelectedRental] = useState(null);

  const fetchRentals = async () => {
    try {
      const response = await api.get("/employee/rentals");
      setRentals(response.data);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    const format = (date, includeYear = false) => {
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const year = includeYear ? `/${date.getFullYear().toString().slice(-2)}` : "";
      return `${month}/${day}${year}`;
    };
  
    return `${format(start, true)} - ${format(end, true)}`;
  };  
  
  const formatCustomerName = (fullName) => {
    const [firstName, lastName] = fullName.split(" ");
    return `${firstName} ${lastName?.[0] || ""}.`;
  };

  return (
    <div className="container-fluid bg-light py-4" style={{ display: "flex", height: "100vh" }}>
      <Navbar onRentalsClick={fetchRentals} />
      <RentalsTable
        rentals={rentals}
        selectedRental={selectedRental}
        onRowClick={setSelectedRental}
        formatCustomerName={formatCustomerName}
        formatDateRange={formatDateRange}
      />
      <div className="bg-white shadow-sm" style={{ width: "35%", padding: "1.5rem", overflowY: "auto" }}>
        <RentalDetails
          selectedRental={selectedRental}
          formatDateRange={formatDateRange}
        />
      </div>
    </div>
  );
}

export default EmployeeMain;