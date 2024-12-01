import React, { useState } from "react";
import NewUserModal from "./NewUserModal";
import FilterIcon from "../../../assets/filter.png";

const UsersTable = ({ users, selectedUser, onRowClick, formatDate, onSaveUser }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filterActive, setFilterActive] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterActive || user.currently_renting;
    return matchesSearch && matchesFilter;
  });

  const handleAddUser = () => setShowModal(true);

  return (
    <div className="bg-light mx-1" style={{ width: "60%", overflowY: "auto" }}>
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom header">
        <h4 className="table-name m-0">Users</h4>
        <div className="d-flex gap-2 align-items-center">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search name or email"
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
          <button className="btn rounded-circle" onClick={handleAddUser}>
            +
          </button>
        </div>
      </div>

      {/* Users Table */}
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
                <td colSpan="4" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New User Modal */}
      <NewUserModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={onSaveUser}
      />
    </div>
  );
};

export default UsersTable;