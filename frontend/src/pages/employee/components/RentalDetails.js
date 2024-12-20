import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import { Modal, Button } from "react-bootstrap";

const RentalDetails = ({ selectedRental, onCompleteRental, onDeleteRental, onConfirmPayment }) => {
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [odometerAfter, setOdometerAfter] = useState("");

  if (!selectedRental) {
    return (
      <>
        <h4 className="mb-4 detail_header border-bottom text-center">Rental Details</h4>
        <p className="text-center">Select a rental to see details.</p>
      </>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
  
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0"); 
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); 
    const year = date.getUTCFullYear();
  
    return `${month}/${day}/${year}`;
  };

  const formatOdometer = (before, after) => {
    const formattedBefore = before?.toLocaleString() || "N/A";
    const formattedAfter = after !== null ? after.toLocaleString() : "...";
    return `${formattedBefore} - ${formattedAfter}`;
  };

  const handleComplete = () => {
    onCompleteRental(selectedRental.rental_id, odometerAfter);
    setShowCompleteModal(false);
  };

  const handleDelete = () => {
    onDeleteRental(selectedRental.rental_id);
    setShowDeleteModal(false);
  };

  const handlePayment = () => {
    onConfirmPayment(selectedRental.rental_id);
    setShowPaymentModal(false);
  };

  return (
    <div>
      <h4 className="mb-4 detail_header border-bottom text-center">Rental Details</h4>
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
              <td><strong>Daily Rate:</strong></td>
              <td>{selectedRental.daily_rental_rate || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="text-center">
        {/* Complete Rental Button */}
        {selectedRental.status === "Ongoing" && (
          <Button
            variant="success"
            className="m-2"
            onClick={() => setShowCompleteModal(true)}
          >
            ✓
          </Button>
        )}

        {/* Confirm Payment Button */}
        {selectedRental.status === "Unpaid" && (
          <Button
            variant="success"
            className="m-2"
            onClick={() => setShowPaymentModal(true)}
          >
            $
          </Button>
        )}

        {/* Delete Rental Button */}
        {selectedRental.status !== "Completed" && selectedRental.status !== "Ongoing" && selectedRental.status !== "Canceled" && (
          <Button
            variant="danger"
            className="m-2"
            onClick={() => setShowDeleteModal(true)}
          >
            ✗
          </Button>
        )}
      </div>


      {/* Complete Rental Modal */}
      <Modal show={showCompleteModal} onHide={() => setShowCompleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Complete Rental</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to complete this rental?</p>
          <div className="mb-3">
            <label htmlFor="odometerAfter" className="form-label">Final Odometer Reading:</label>
            <input
              type="number"
              id="odometerAfter"
              className="form-control"
              value={odometerAfter}
              onChange={(e) => setOdometerAfter(Number(e.target.value))}
              min={selectedRental.odometer_before + 1}
              required
            />
            {odometerAfter <= selectedRental.odometer_before && odometerAfter !== "" && (
              <small className="text-danger">
                Odometer reading must be greater than {selectedRental.odometer_before}.
              </small>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowCompleteModal(false);
              setOdometerAfter("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleComplete}
            disabled={!odometerAfter || odometerAfter <= selectedRental.odometer_before}
          >
            Complete Rental
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Rental Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Rental</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this rental? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Rental
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to confirm payment for this rental?</p>
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
    </div>
  );
};

export default RentalDetails;
