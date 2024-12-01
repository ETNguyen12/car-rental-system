import React, { useState } from "react";
import StatusBadge from "./StatusBadge";

const VehiclesTable = ({ vehicles, selectedVehicle, onRowClick, onAddVehicle }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          {/* Add Button */}
          <button
            className="btn rounded-circle"
            onClick={onAddVehicle}
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
              <th style={{ width: "20%" }}>Daily Rate</th>
              <th style={{ width: "20%" }}>Odometer</th>
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
                  <td>${vehicle.daily_rental_rate}</td>
                  <td>{vehicle.odometer_reading}</td>
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
    </div>
  );
};

export default VehiclesTable;