import React from "react";

const Navbar = ({ onRentalsClick }) => {
  return (
    <div
      className="bg-white shadow-sm"
      style={{ width: "15%", minWidth: "150px" }}
    >
      <h4 className="p-3 border-bottom">Tables</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <button className="btn btn-link nav-link active" onClick={onRentalsClick}>
            Rentals
          </button>
        </li>
        <li className="nav-item">
          <button className="btn btn-link nav-link">Users</button>
        </li>
        <li className="nav-item">
          <button className="btn btn-link nav-link">Vehicles</button>
        </li>
        <li className="nav-item">
          <button className="btn btn-link nav-link">Rental Fees</button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;