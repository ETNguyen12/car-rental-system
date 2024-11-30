import React from "react";
import StatusBadge from "./StatusBadge";

const RentalDetails = ({ selectedRental }) => {
    if (!selectedRental) {
        return (
          <>
            <h4 className="mb-4 border-bottom pb-2 text-center">Rental Details</h4>
            <p className="text-center">Select a rental to see details.</p>
          </>
        );
    }
      

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const formatOdometer = (before, after) => {
    const formattedBefore = before?.toLocaleString() || "N/A";
    const formattedAfter = after !== null ? after.toLocaleString() : "...";
    return `${formattedBefore} - ${formattedAfter}`;
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
              <td><strong>Odometer:</strong></td>
              <td>{formatOdometer(selectedRental.odometer_before, selectedRental.odometer_after)}</td>
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
              <td><strong>Specification:</strong></td>
              <td>{selectedRental.vehicle}</td>
            </tr>
            <tr>
              <td><strong>Color:</strong></td>
              <td>{selectedRental.color}</td>
            </tr>
            <tr>
              <td><strong>Fuel:</strong></td>
              <td>{selectedRental.fuel || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Seat Capacity:</strong></td>
              <td>{selectedRental.seat_capacity || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Daily Rental Rate:</strong></td>
              <td>{selectedRental.daily_rental_rate || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentalDetails;