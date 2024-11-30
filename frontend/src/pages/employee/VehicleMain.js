import { useState, useEffect } from "react";
import api from "../../services/api";
import Navbar from "./components/Navbar";
import VehiclesTable from "./components/VehiclesTable";
import VehicleDetails from "./components/VehicleDetails";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function VehicleMain() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/employee/vehicles/info");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to fetch vehicles.");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="container-fluid bg-light py-2" style={{ display: "flex", height: "100vh" }}>
      <Navbar onVehiclesClick={fetchVehicles} />
      <VehiclesTable
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        onRowClick={setSelectedVehicle}
      />
      <div className="bg-white shadow-sm" style={{ width: "35%", padding: "1.5rem", overflowY: "auto" }}>
        <VehicleDetails selectedVehicle={selectedVehicle} />
      </div>
    </div>
  );
}

export default VehicleMain;