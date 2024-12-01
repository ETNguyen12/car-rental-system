import React, { useState } from "react";
import NewUserModal from "./NewUserModal";

const UsersTable = ({ users, selectedUser, onRowClick, formatDate, onSaveUser }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => setShowModal(true);

  return (
    <div className="bg-light mx-1" style={{ width: "60%", overflowY: "auto" }}>
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom header">
        <h4 className="table-name m-0">Users</h4>
        <div className="d-flex gap-2 align-items-center">
          <input
            type="text"
            placeholder="Search name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
            style={{ maxWidth: "400px" }}
          />
          <button className="btn rounded-circle" onClick={handleAddUser}>
            +
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: "40%" }}>Name</th>
              <th style={{ width: "40%" }}>Email</th>
              <th style={{ width: "10%" }}>State</th>
              <th style={{ width: "10%" }}>Ongoing?</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => onRowClick(user)}
                  className={selectedUser?.id === user.id ? "table-primary" : ""}
                  style={{ cursor: "pointer" }}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.state}</td>
                  <td>{user.currently_renting ? "✓" : ""}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <NewUserModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={onSaveUser}
      />
    </div>
  );
};

export default UsersTable;