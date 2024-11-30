import React from "react";
import StatusBadge from "./StatusBadge";

const RentalDetails = ({ selectedRental, formatDateRange }) => {
  if (!selectedRental) {
    return <p className="text-center">Select a rental to see details.</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
  
    // Convert hours to 12-hour format
    const hours12 = (hours % 12 || 12).toString();
  
    return `${month}/${day}/${year}, ${hours12}:${minutes} ${period}`;
  };  

  return (
    <div>
      <h4 className="mb-4 border-bottom pb-2 text-center">Rental Details</h4>
      <div className="mb-3">
        <h6 className="text-primary">Customer Information</h6>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{selectedRental.customer_name}</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>{selectedRental.email || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Phone:</strong></td>
              <td>{selectedRental.phone_number || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mb-3">
        <h6 className="text-primary">Rental Information</h6>
        <table className="table table-bordered">
          <tbody>
            <tr>
                <td><strong>Pickup Date:</strong></td>
                <td>{formatDate(selectedRental.pickup_date)}</td>
            </tr>
            <tr>
                <td><strong>Dropoff Date:</strong></td>
                <td>{formatDate(selectedRental.dropoff_date)}</td>
            </tr>
            <tr>
              <td><strong>Total Price:</strong></td>
              <td>${selectedRental.total_price || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Status:</strong></td>
              <td><StatusBadge status={selectedRental.status} /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mb-3">
        <h6 className="text-primary">Vehicle Information</h6>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td><strong>Model:</strong></td>
              <td>{selectedRental.vehicle}</td>
            </tr>
            <tr>
              <td><strong>VIN:</strong></td>
              <td>{selectedRental.vin || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentalDetails;