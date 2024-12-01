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

  const updateVehicleOdometers = async () => {
    try {
      await api.put("/employee/vehicles/update_odometer");
      console.log("Vehicle odometer values updated successfully");
    } catch (error) {
      console.error("Error updating vehicle odometer values:", error);
    }
  };

  const onDeleteVehicle = async (vehicleId) => {
    try {
      await api.delete(`/employee/vehicles/${vehicleId}`);
      toast.success("Vehicle deleted successfully!");
      fetchVehicles();
      setSelectedVehicle(null);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Failed to delete vehicle. Please try again.");
    }
  };

  const onScheduleMaintenance = async (vehicleId) => {
    try {
      await api.put(`/employee/maintenance/${vehicleId}/schedule`);
      toast.success("Maintenance confirmed successfully!");
      fetchVehicles();
      setSelectedVehicle(null);
    } catch (error) {
      console.error("Error confirming maintenance:", error);
      toast.error("Failed to confirm maintenance. Please try again.");
    }
  };

  const onFinishMaintenance = async (vehicleId) => {
    try {
      await api.put(`/employee/maintenance/${vehicleId}/finish`);
      toast.success("Maintenance finished successfully!");
      fetchVehicles();
      setSelectedVehicle(null);
    } catch (error) {
      console.error("Error confirming to finish maintenance:", error);
      toast.error("Failed to confirm finishing maintenance. Please try again.");
    }
  };

  const onSaveVehicle = async (newVehicle) => {
    try {
      await api.post("/employee/vehicles/create", newVehicle);
      toast.success("Vehicle added successfully!");
      fetchVehicles();
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
    updateVehicleOdometers(); 
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
        <VehicleDetails 
          selectedVehicle={selectedVehicle} 
          onDeleteVehicle={onDeleteVehicle}
          onScheduleMaintenance={onScheduleMaintenance}
          onFinishMaintenance={onFinishMaintenance}
        />
      </div>
    </div>
  );
}

export default VehicleMain;