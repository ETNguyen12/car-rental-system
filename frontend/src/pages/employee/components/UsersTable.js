import React from "react";

const UsersTable = ({ users, selectedUser, onRowClick, formatDate }) => {
  return (
    <div className="bg-light mx-1" style={{ width: "60%", overflowY: "auto" }}>
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom header">
        <h4 className="table-name m-0">Users</h4>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: "30%" }}>Name</th>
              <th style={{ width: "40%" }}>Email</th>
              <th style={{ width: "20%" }}>Birth Date</th>
              <th style={{ width: "10%" }}>State</th>
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
                <td>{formatDate(user.birth_date)}</td>
                <td>{user.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;