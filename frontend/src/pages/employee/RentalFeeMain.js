import { useState, useEffect } from "react";
import api from "../../services/api";
import Navbar from "./components/Navbar";
import FeesTable from "./components/FeesTable"; 
import FeeDetails from "./components/FeeDetails";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/employee.css";

function FeeMain() {
  const [fees, setFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);

  const fetchFees = async () => {
    try {
      const response = await api.get("/employee/rental-fees/info");
      setFees(response.data);
    } catch (error) {
      console.error("Error fetching fees:", error);
      toast.error("Failed to fetch fees.");
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchFees();
    };

    initializeData();
  }, []);

  const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2)}`;
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
  
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0"); 
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); 
    const year = date.getUTCFullYear();
  
    return `${month}/${day}/${year}`;
  };

  return (
    <div className="container-fluid bg-light py-2" style={{ display: "flex", height: "100vh" }}>
      <Navbar onFeesClick={fetchFees} />
      <FeesTable
        fees={fees}
        selectedFee={selectedFee}
        onRowClick={setSelectedFee}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        fetchFees={fetchFees}
      />
      <div className="bg-white shadow-sm" style={{ width: "35%", padding: "1.5rem", overflowY: "auto" }}>
        <FeeDetails
          selectedFee={selectedFee}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
}

export default FeeMain;