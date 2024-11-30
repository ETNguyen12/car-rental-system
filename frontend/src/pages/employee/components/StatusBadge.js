import React from "react";

const StatusBadge = ({ status }) => {
  const badgeClass = {
    "Unpaid": "bg-danger text-white",
    "Ongoing": "bg-info",
    "Paid": "bg-success",
    "Reserved": "bg-success",
  }[status] || "bg-secondary";

  return <span className={`badge ${badgeClass}`}>{status}</span>;
};

export default StatusBadge;