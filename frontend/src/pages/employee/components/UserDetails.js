import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const UserDetails = ({ selectedUser, formatDate, onDeleteUser }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!selectedUser) {
    return (
      <>
        <h4 className="mb-4 detail_header border-bottom pb-2 text-center">User Details</h4>
        <p className="text-center">Select a user to see details.</p>
      </>
    );
  }

  const formatAddress = (user) => {
    const addressLine2 = user.address_line2 ? `${user.address_line2}\n` : "";
    return `${user.address_line1}\n${addressLine2}${user.city}, ${user.state} ${user.zip_code}`;
  };

  const handleDeleteUser = () => {
    onDeleteUser(selectedUser.id);
    setShowDeleteModal(false);
  };

  return (
    <div>
      <h4 className="mb-4 detail_header border-bottom pb-2 text-center">User Details</h4>
      <div className="mb-3">
        <h6 className="text-primary">Customer Information</h6>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{selectedUser.name}</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>{selectedUser.email}</td>
            </tr>
            <tr>
              <td><strong>Phone Number:</strong></td>
              <td>{selectedUser.phone_number}</td>
            </tr>
            <tr>
              <td><strong>Birth Date:</strong></td>
              <td>{formatDate(selectedUser.birth_date)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mb-3">
        <h6 className="text-primary">Customer Details</h6>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td><strong>Address:</strong></td>
              <td style={{ whiteSpace: "pre-line" }}>{formatAddress(selectedUser)}</td>
            </tr>
            <tr>
              <td><strong>License:</strong></td>
              <td>{selectedUser.license_number}</td>
            </tr>
            <tr>
              <td><strong>Policy:</strong></td>
              <td>{selectedUser.policy_number}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="text-center">
        <Button
          variant="danger"
          className="m-2"
          onClick={() => setShowDeleteModal(true)}
        >
          ✗
        </Button>
      </div>

      {/* Delete User Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this user? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserDetails;