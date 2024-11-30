import React from "react";

const StatusBadge = ({ status }) => {
  const badgeClass = {
    "Pending Payment": "bg-warning text-dark",
    "Ongoing": "bg-success",
    "Completed": "bg-secondary",
    "Cancelled": "bg-danger",
  }[status] || "bg-dark";

  return <span className={`badge ${badgeClass}`}>{status}</span>;
};

export default StatusBadge;