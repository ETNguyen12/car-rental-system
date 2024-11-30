import React from "react";

const Navbar = ({ onRentalsClick }) => {
  return (
    <div
      className="bg-white shadow-sm"
      style={{ width: "10%", minWidth: "150px" }}
    >
      <h4 className="p-3 border-bottom table_name">Tables</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <button className="btn btn-link nav-link active" onClick={onRentalsClick}>
            Rentals
          </button>
        </li>
        <li className="nav-item">
          <button className="btn btn-link nav-link">Rental Fees</button>
        </li>
        <li className="nav-item">
          <button className="btn btn-link nav-link">Vehicles</button>
        </li>
        <li className="nav-item">
          <button className="btn btn-link nav-link">Users</button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;