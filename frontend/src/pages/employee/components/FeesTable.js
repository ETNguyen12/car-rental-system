import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import FilterIcon from "../../../assets/filter.png"; // Ensure the path is correct
import NewFeeModal from "./NewFeeModal";

const FeesTable = ({
  fees,
  selectedFee,
  onRowClick,
  formatCurrency,
  formatDate,
  fetchFees,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Filter fees based on search query and filter state
  const filteredFees = fees.filter((fee) => {
    const matchesSearch = fee.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterActive || fee.status !== "Paid"; 
    return matchesSearch && matchesFilter;
  });

  const handleAddFee = () => setShowModal(true);

  const handleSaveFee = (feeData) => {
    // Call API to save the fee
    fetchFees(); // Refresh the fee list
    setShowModal(false); // Close the modal
  };

  return (
    <div className="bg-light mx-1" style={{ width: "60%", overflowY: "auto" }}>
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom header">
        <h4 className="table-name m-0">Rental Fees</h4>
        <div className="d-flex gap-2 align-items-center">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
            style={{ maxWidth: "400px" }}
          />

          {/* Filter Button */}
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

          {/* Add Button */}
          <button className="btn rounded-circle" onClick={handleAddFee}>
            +
          </button>
        </div>
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
            {filteredFees.length > 0 ? (
              filteredFees.map((fee) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No fees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Fee Modal */}
      <NewFeeModal
        show={showModal}
        onClose={() => setShowModal(false)}
        fetchFees={fetchFees}
      />
    </div>
  );
};

export default FeesTable;