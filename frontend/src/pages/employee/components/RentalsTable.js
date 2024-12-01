import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import NewRentalModal from "./NewRentalModal";
import FilterIcon from "../../../assets/filter.png"; 

const RentalsTable = ({ rentals, selectedRental, onRowClick, formatCustomerName, formatDateRange, fetchRentals }) => {
  const [showModal, setShowModal] = useState(false);
  const [filterActive, setFilterActive] = useState(false);

  const filteredRentals = filterActive
    ? rentals.filter((rental) => rental.status !== "Completed" && rental.status !== "Canceled")
    : rentals;

  return (
    <div className="bg-light mx-1" style={{ width: "60%", overflowY: "auto" }}>
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom header">
        <h4 className="table-name m-0">Rental Reservations</h4>
        <div className="d-flex gap-2 align-items-center">
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
          <button
            className="btn rounded-circle"
            onClick={() => setShowModal(true)}
          >
            +
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: "25%" }}>Name</th>
              <th style={{ width: "35%" }}>Vehicle</th>
              <th style={{ width: "25%" }}>Dates</th>
              <th style={{ width: "15%" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRentals.map((rental) => (
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

      <NewRentalModal
        show={showModal}
        onClose={() => setShowModal(false)}
        fetchRentals={fetchRentals}
      />
    </div>
  );
};

export default RentalsTable;
