import { useState, useEffect } from "react";
import api from "../../services/api";
import Navbar from "./components/Navbar";
import VehiclesTable from "./components/VehiclesTable";
import VehicleDetails from "./components/VehicleDetails";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/employee.css";

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

  const onSaveVehicle = async (newVehicle) => {
    try {
      const response = await api.post("/employee/vehicles/create", newVehicle);
      toast.success("Vehicle added successfully!");
      fetchVehicles(); // Refresh the list of vehicles
    } catch (error) {
      console.error("Error saving vehicle:", error);
      if (error.response?.status === 409) {
        toast.error("A vehicle with this VIN or license plate already exists.");
      } else {
        toast.error("Failed to add vehicle. Please try again.");
      }
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
        onSaveVehicle={onSaveVehicle}
      />
      <div className="bg-white shadow-sm" style={{ width: "35%", padding: "1.5rem", overflowY: "auto" }}>
        <VehicleDetails selectedVehicle={selectedVehicle} />
      </div>
    </div>
  );
}

export default VehicleMain;