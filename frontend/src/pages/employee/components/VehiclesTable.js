import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import NewVehicleModal from "./NewVehicleModal";
import FilterIcon from "../../../assets/filter.png";

const VehiclesTable = ({ vehicles, selectedVehicle, onRowClick, onSaveVehicle }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filterActive, setFilterActive] = useState(false);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterActive || vehicle.status === "Available";
    return matchesSearch && matchesFilter;
  });

  const handleAddVehicle = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-light mx-1" style={{ width: "60%", overflowY: "auto" }}>
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom header">
        <h4 className="table-name m-0">Vehicles</h4>
        <div className="d-flex gap-2 align-items-center">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search vehicle"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
            style={{ maxWidth: "400px" }}
          />

          {/* Filter Button */}
          <div
            style={{
              position: "relative",
              cursor: "pointer",
              width: "32px",
              height: "32px",
            }}
            onClick={() => setFilterActive(!filterActive)}
          >
            <img
              src={FilterIcon}
              alt="Filter Icon"
              style={{ width: "100%", height: "100%" }}
            />
            {!filterActive && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "4px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  lineHeight: "12px",
                  height: "18px",
                  width: "18px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                X
              </span>
            )}
          </div>

          {/* Add Button */}
          <button
            className="btn rounded-circle"
            onClick={handleAddVehicle}
          >
            +
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: "40%" }}>Vehicle</th>
              <th style={{ width: "20%" }}>Odometer</th>
              <th style={{ width: "20%" }}>Daily Rate</th>
              <th style={{ width: "20%" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  onClick={() => onRowClick(vehicle)}
                  className={selectedVehicle?.id === vehicle.id ? "table-primary" : ""}
                  style={{ cursor: "pointer" }}
                >
                  <td>{vehicle.model}</td>
                  <td>{vehicle.odometer_reading}</td>
                  <td>${vehicle.daily_rental_rate}</td>
                  <td><StatusBadge status={vehicle.status} /></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No vehicles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Vehicle Modal */}
      <NewVehicleModal
        show={showModal}
        onClose={handleCloseModal}
        onSave={onSaveVehicle}
      />
    </div>
  );
};

export default VehiclesTable;