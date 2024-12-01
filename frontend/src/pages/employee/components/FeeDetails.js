import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import { Modal, Button } from "react-bootstrap";

const FeeDetails = ({
  selectedFee,
  formatCurrency,
  formatDate,
  onDeleteFee,
  onConfirmFeePayment,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (!selectedFee) {
    return (
      <>
        <h4 className="mb-4 border-bottom pb-2 text-center">Fee Details</h4>
        <p className="text-center">Select a fee to see details.</p>
      </>
    );
  }

  const handleDelete = () => {
    onDeleteFee(selectedFee.id);
    setShowDeleteModal(false);
  };

  const handlePayment = () => {
    onConfirmFeePayment(selectedFee.id);
    setShowPaymentModal(false);
  };

  return (
    <div>
      <h4 className="mb-4 border-bottom pb-2 text-center">Fee Details</h4>
      <div className="mb-3">
        <h6 className="text-primary">Customer Information</h6>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{selectedFee.name}</td>
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
              <td><StatusBadge status={selectedFee.status} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="text-center">
        {/* Confirm Payment Button */}
        {selectedFee.status === "Unpaid" && (
          <Button
            variant="success"
            className="m-2"
            onClick={() => setShowPaymentModal(true)}
          >
            $
          </Button>
        )}

        {/* Delete Fee Button */}
        {selectedFee.status === "Unpaid" && (
        <Button
          variant="danger"
          className="m-2"
          onClick={() => setShowDeleteModal(true)}
        >
          ✗
        </Button>
        )}
      </div>

      {/* Confirm Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to confirm payment for this fee?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </Button>
          <Button variant="info" onClick={handlePayment}>
            Confirm Payment
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Fee Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Fee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this fee? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Fee
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FeeDetails;