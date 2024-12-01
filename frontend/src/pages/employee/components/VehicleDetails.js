import React from "react";
import StatusBadge from "./StatusBadge";

const VehicleDetails = ({ selectedVehicle }) => {
  if (!selectedVehicle) {
    return (
      <>
        <h4 className="mb-4 detail_header border-bottom pb-2 text-center">Vehicle Details</h4>
        <p className="text-center">Select a vehicle to see details.</p>
      </>
    );
  }

  return (
    <div>
      <h4 className="mb-4 detail_header border-bottom pb-2 text-center">Vehicle Details</h4>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <td><strong>Specification:</strong></td>
            <td>{selectedVehicle.model}</td>
          </tr>
          <tr>
            <td><strong>Color:</strong></td>
            <td>{selectedVehicle.color}</td>
          </tr>
          <tr>
            <td><strong>Fuel:</strong></td>
            <td>{selectedVehicle.fuel}</td>
          </tr>
          <tr>
            <td><strong>Odometer:</strong></td>
            <td>{selectedVehicle.odometer_reading}</td>
          </tr>
          <tr>
            <td><strong>VIN:</strong></td>
            <td>{selectedVehicle.vin}</td>
          </tr>
          <tr>
            <td><strong>Daily Rate:</strong></td>
            <td>${selectedVehicle.daily_rental_rate}</td>
          </tr>
          <tr>
            <td><strong>Status:</strong></td>
            <td><StatusBadge status={selectedVehicle.status}/></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default VehicleDetails;