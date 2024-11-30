import React, { useState, useEffect } from "react";

const RentalFeesTable = ({ rentalFees, formatCurrency, formatDate }) => {
  return (
    <div className="bg-light mx-1" style={{ width: "60%", overflowY: "auto" }}>
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom header">
        <h4 className="table-name">Rental Fees</h4>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: "30%" }}>Fee Name</th>
              <th style={{ width: "30%" }}>Amount</th>
              <th style={{ width: "40%" }}>Date Applied</th>
            </tr>
          </thead>
          <tbody>
            {rentalFees.map((fee) => (
              <tr key={fee.id}>
                <td>{fee.fee_name}</td>
                <td>{formatCurrency(fee.amount)}</td>
                <td>{formatDate(fee.date_applied)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentalFeesTable;