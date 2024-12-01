import React from "react";
import StatusBadge from "./StatusBadge"; 

const FeesTable = ({ fees, selectedFee, onRowClick, formatCurrency, formatDate }) => {
  return (
    <div className="bg-light mx-1" style={{ width: "60%", overflowY: "auto" }}>
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom header">
        <h4 className="table-name m-0">Rental Fees</h4>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: "25%" }}>Name</th>
              <th style={{ width: "25%" }}>Type</th>
              <th style={{ width: "15%" }}>Amount</th>
              <th style={{ width: "20%" }}>Due Date</th>
              <th style={{ width: "15%" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr
                key={fee.id}
                onClick={() => onRowClick(fee)}
                className={selectedFee?.id === fee.id ? "table-primary" : ""}
                style={{ cursor: "pointer" }}
              >
                <td>{fee.name}</td>
                <td>{fee.type}</td>
                <td>{formatCurrency(fee.amount)}</td>
                <td>{formatDate(fee.due_date)}</td>
                <td>
                  <StatusBadge status={fee.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeesTable;