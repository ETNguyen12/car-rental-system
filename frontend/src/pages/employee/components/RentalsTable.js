import React from "react";
import StatusBadge from "./StatusBadge";

const RentalsTable = ({ rentals, selectedRental, onRowClick, formatCustomerName, formatDateRange }) => {
    
  return (
    <div className="bg-light" style={{ width: "60%", overflowY: "auto" }}>
      <h4 className="p-3 border-bottom">Rentals</h4>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: "25%" }}>Customer</th>
              <th style={{ width: "35%" }}>Vehicle</th>
              <th style={{ width: "25%" }}>Dates</th>
              <th style={{ width: "15%" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental) => (
              <tr
                key={rental.rental_id}
                onClick={() => onRowClick(rental)}
                className={selectedRental?.rental_id === rental.rental_id ? "table-primary" : ""}
                style={{ cursor: "pointer" }}
              >
                <td>{formatCustomerName(rental.customer_name)}</td>
                <td>{rental.vehicle}</td>
                <td>{formatDateRange(rental.pickup_date, rental.dropoff_date)}</td>
                <td>
                  <StatusBadge status={rental.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentalsTable;