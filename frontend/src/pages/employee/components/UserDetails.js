import React from "react";

const UserDetails = ({ selectedUser }) => {
  if (!selectedUser) {
    return (
      <>
        <h4 className="mb-4 border-bottom pb-2 text-center">User Details</h4>
        <p className="text-center">Select a user to see details.</p>
      </>
    );
  }

  return (
    <div>
      <h4 className="mb-4 border-bottom pb-2 text-center">User Details</h4>
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
            <td><strong>Role:</strong></td>
            <td>{selectedUser.role}</td>
          </tr>
          <tr>
            <td><strong>Phone Number:</strong></td>
            <td>{selectedUser.phone_number}</td>
          </tr>
          <tr>
            <td><strong>Created At:</strong></td>
            <td>{new Date(selectedUser.created_at).toLocaleDateString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserDetails;