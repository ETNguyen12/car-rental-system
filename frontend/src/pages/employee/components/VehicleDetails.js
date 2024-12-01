import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import { Modal, Button } from "react-bootstrap";

const VehicleDetails = ({ selectedVehicle, onScheduleMaintenance, onDeleteVehicle, onFinishMaintenance }) => {
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFinishMaintenanceModal, setShowFinishMaintenanceModal] = useState(false);

  if (!selectedVehicle) {
    return (
      <>
        <h4 className="mb-4 detail_header border-bottom pb-2 text-center">Vehicle Details</h4>
        <p className="text-center">Select a vehicle to see details.</p>
      </>
    );
  }

  const handleScheduleMaintenance = () => {
    onScheduleMaintenance(selectedVehicle.id);
    setShowMaintenanceModal(false);
  };

  const handleDeleteVehicle = () => {
    onDeleteVehicle(selectedVehicle.id);
    setShowDeleteModal(false);
  };

  const handleFinishMaintenance = () => {
    onFinishMaintenance(selectedVehicle.id);
    setShowFinishMaintenanceModal(false);
  };

  return (
    <div>
      <h4 className="mb-4 detail_header border-bottom pb-2 text-center">Vehicle Details</h4>
      <div className="mb-3">
        <h6 className="text-primary">Vehicle Information</h6>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td><strong>Specification:</strong></td>
              <td>{selectedVehicle.model}</td>
            </tr>
            <tr>
              <td><strong>Color:</strong></td>
              <td>{selectedVehicle.color}</td>
            </tr>
            <tr>
              <td><strong>Fuel:</strong></td>
              <td>{selectedVehicle.fuel}</td>
            </tr>
            <tr>
              <td><strong>Odometer:</strong></td>
              <td>{selectedVehicle.odometer_reading.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>VIN:</strong></td>
              <td>{selectedVehicle.vin}</td>
            </tr>
            <tr>
              <td><strong>Daily Rate:</strong></td>
              <td>${selectedVehicle.daily_rental_rate}</td>
            </tr>
            <tr>
              <td><strong>Status:</strong></td>
              <td><StatusBadge status={selectedVehicle.status} /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mb-3">
        <h6 className="text-primary">Vehicle Stats</h6>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td><strong>Specification:</strong></td>
              <td>{selectedVehicle.model}</td>
            </tr>
            <tr>
              <td><strong>Color:</strong></td>
              <td>{selectedVehicle.color}</td>
            </tr>
            <tr>
              <td><strong>Fuel:</strong></td>
              <td>{selectedVehicle.fuel}</td>
            </tr>
            <tr>
              <td><strong>Odometer:</strong></td>
              <td>{selectedVehicle.odometer_reading.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>VIN:</strong></td>
              <td>{selectedVehicle.vin}</td>
            </tr>
            <tr>
              <td><strong>Daily Rate:</strong></td>
              <td>${selectedVehicle.daily_rental_rate}</td>
            </tr>
            <tr>
              <td><strong>Status:</strong></td>
              <td><StatusBadge status={selectedVehicle.status} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="text-center">
        {/* Schedule Maintenance Button */}
        {selectedVehicle.status !== "Maintenance" && selectedVehicle.status !== "In Use" && (
          <Button
            variant="warning"
            className="m-2"
            onClick={() => setShowMaintenanceModal(true)}
          >
            🛠️
        </Button>
        )}


        {/* Finish Maintenance Button */}
        {selectedVehicle.status === "Maintenance" && (
          <Button
            variant="success"
            className="m-2"
            onClick={() => setShowFinishMaintenanceModal(true)}
          >
            ✓
          </Button>
        )}

        {/* Delete Vehicle Button */}
        {selectedVehicle.status !== "In Use" && (
          <Button
            variant="danger"
            className="m-2"
            onClick={() => setShowDeleteModal(true)}
          >
            ✗
          </Button>
        )}
      </div>

      {/* Maintenance Modal */}
      <Modal show={showMaintenanceModal} onHide={() => setShowMaintenanceModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Schedule Maintenance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to schedule maintenance for this vehicle?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMaintenanceModal(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleScheduleMaintenance}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Finish Maintenance Modal */}
      <Modal show={showFinishMaintenanceModal} onHide={() => setShowFinishMaintenanceModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Finish Maintenance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to mark this vehicle's maintenance as complete?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFinishMaintenanceModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleFinishMaintenance}>
            Finish Maintenance
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Vehicle Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Vehicle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this vehicle? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteVehicle}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VehicleDetails;