import React from "react";

const FeeDetails = ({ selectedFee, formatCurrency, formatDate }) => {
  if (!selectedFee) {
    return (
      <>
        <h4 className="mb-4 border-bottom pb-2 text-center">Fee Details</h4>
        <p className="text-center">Select a fee to see details.</p>
      </>
    );
  }

  return (
    <div>
      <h4 className="mb-4 border-bottom pb-2 text-center">Fee Details</h4>
      <div className="mb-3">
        <h6 className="text-primary">Customer Information</h6>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{selectedFee.customer_name}</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>{selectedFee.email || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Phone:</strong></td>
              <td>{selectedFee.phone_number || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mb-3">
        <h6 className="text-primary">Fee Information</h6>
        <table className="table table-bordered">
            <tbody>
            <tr>
                <td><strong>Name:</strong></td>
                <td>{selectedFee.name}</td>
            </tr>
            <tr>
                <td><strong>Type:</strong></td>
                <td>{selectedFee.type}</td>
            </tr>
            <tr>
                <td><strong>Description:</strong></td>
                <td>{selectedFee.description || "N/A"}</td>
            </tr>
            <tr>
                <td><strong>Amount:</strong></td>
                <td>{formatCurrency(selectedFee.amount)}</td>
            </tr>
            <tr>
                <td><strong>Due Date:</strong></td>
                <td>{formatDate(selectedFee.due_date)}</td>
            </tr>
            <tr>
                <td><strong>Status:</strong></td>
                <td>{selectedFee.status}</td>
            </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeDetails;