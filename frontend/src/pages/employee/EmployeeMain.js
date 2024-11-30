import { useState, useEffect } from "react";
import api from '../../services/api';
import Navbar from "./components/Navbar";
import RentalsTable from "./components/RentalsTable";
import RentalDetails from "./components/RentalDetails";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

function EmployeeMain() {
  const [rentals, setRentals] = useState([]);
  const [selectedRental, setSelectedRental] = useState(null);

  const fetchRentals = async () => {
    try {
      const response = await api.get("/employee/rentals/info");
      setRentals(response.data);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    }
  };

  const updateVehicleOdometers = async () => {
    try {
      await api.put("/employee/vehicles/update_odometer");
      console.log("Vehicle odometer values updated successfully");
    } catch (error) {
      console.error("Error updating vehicle odometer values:", error);
    }
  };

  const updateRentalStatus = async () => {
    try {
      await api.put("/employee/rentals/update_status");
      console.log("Rental statuses updated successfully");
    } catch (error) {
      console.error("Error updating rental statuses:", error);
      toast.error("Failed to update rental statuses.");
    }
  };

  const onCompleteRental = async (rentalId, odometerAfter) => {
    try {
      await api.put(`/employee/rentals/${rentalId}/complete`, { odometer_after: odometerAfter });
      toast.success("Rental marked as completed successfully!");
      fetchRentals(); 
      setSelectedRental(null); 
    } catch (error) {
      console.error("Error completing rental:", error);
      toast.error("Failed to mark rental as completed. Please try again.");
    }
  };

  const onDeleteRental = async (rentalId) => {
    try {
      await api.delete(`/employee/rentals/${rentalId}`);
      toast.success("Rental deleted successfully!");
      fetchRentals(); 
      setSelectedRental(null); 
    } catch (error) {
      console.error("Error deleting rental:", error);
      toast.error("Failed to delete rental. Please try again.");
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await updateVehicleOdometers(); 
      await updateRentalStatus(); 
      await fetchRentals(); 
    };

    initializeData();
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
    <div className="container-fluid bg-light py-2" style={{ display: "flex", height: "100vh" }}>
      <Navbar onRentalsClick={fetchRentals} />
      <RentalsTable
        rentals={rentals}
        selectedRental={selectedRental}
        onRowClick={setSelectedRental}
        formatCustomerName={formatCustomerName}
        formatDateRange={formatDateRange}
        fetchRentals={fetchRentals}
      />
      <div className="bg-white shadow-sm" style={{ width: "35%", padding: "1.5rem", overflowY: "auto" }}>
        <RentalDetails
          selectedRental={selectedRental}
          onCompleteRental={onCompleteRental}
          onDeleteRental={onDeleteRental}
          formatDateRange={formatDateRange}
        />
      </div>
    </div>
  );
}

export default EmployeeMain;
