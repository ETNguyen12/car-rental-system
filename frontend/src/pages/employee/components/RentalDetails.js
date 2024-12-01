import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import { Modal, Button } from "react-bootstrap";

const RentalDetails = ({ selectedRental, onCompleteRental, onDeleteRental }) => {
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const handleComplete = () => {
    onCompleteRental(selectedRental.rental_id, odometerAfter);
    setShowCompleteModal(false);
  };

  const handleDelete = () => {
    onDeleteRental(selectedRental.rental_id);
    setShowDeleteModal(false);
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
        <Button
          variant="success"
          className="m-2"
          onClick={() => setShowCompleteModal(true)}
          disabled={selectedRental.status != "Ongoing"}
        >
          ✓
        </Button>
        <Button
          variant="danger"
          onClick={() => setShowDeleteModal(true)}
          disabled={selectedRental.status === "Completed" || selectedRental.status === "Ongoing"}
        >
          ✗
        </Button>
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
              onChange={(e) => setOdometerAfter(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCompleteModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleComplete}>
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
    </div>
  );
};

export default RentalDetails;
