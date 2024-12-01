import React from "react";
import StatusBadge from "./StatusBadge";

const VehiclesTable = ({ vehicles, selectedVehicle, onRowClick }) => {
  return (
    <div className="bg-light mx-1" style={{ width: "60%", overflowY: "auto" }}>
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom header">
        <h4 className="table-name m-0">Vehicles</h4>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: "50%" }}>Vehicle</th>
              <th style={{ width: "25%" }}>Odometer</th>
              <th style={{ width: "25%" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                onClick={() => onRowClick(vehicle)}
                className={selectedVehicle?.id === vehicle.id ? "table-primary" : ""}
                style={{ cursor: "pointer" }}
              >
                <td>{vehicle.model}</td>
                <td>{vehicle.odometer_reading}</td>
                <td><StatusBadge status={vehicle.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehiclesTable;