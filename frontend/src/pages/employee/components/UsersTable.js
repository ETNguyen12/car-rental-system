import React from "react";

const UsersTable = ({ users, selectedUser, onRowClick }) => {
  return (
    <div className="bg-light mx-1" style={{ width: "60%", overflowY: "auto" }}>
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom header">
        <h4 className="table-name">Users</h4>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: "30%" }}>Name</th>
              <th style={{ width: "25%" }}>Email</th>
              <th style={{ width: "25%" }}>Phone</th>
              <th style={{ width: "25%" }}>Last Rental</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                onClick={() => onRowClick(user)}
                className={selectedUser?.id === user.id ? "table-primary" : ""}
                style={{ cursor: "pointer" }}
              >
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone_number}</td>
                <td>{user.phone_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;