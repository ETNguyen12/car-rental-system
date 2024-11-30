import React from "react";

const VehiclesTable = ({ vehicles, selectedVehicle, onRowClick }) => {
  return (
    <div className="bg-light mx-1" style={{ width: "60%", overflowY: "auto" }}>
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom header">
        <h4 className="table-name">Vehicles</h4>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: "30%" }}>Vehicle</th>
              <th style={{ width: "30%" }}>Odometer</th>
              <th style={{ width: "30%" }}>Status</th>
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
                <td>{vehicle.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehiclesTable;