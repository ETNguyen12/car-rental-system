import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div
      className="bg-white shadow-sm"
      style={{ width: "10%", minWidth: "150px" }}
    >
      <h4 className="p-3 border-bottom table_name">Tables</h4>
      <ul className="nav flex-column">
        <Link to="/employee" className="btn btn-link nav-link">
          Rentals
        </Link>
        <Link to="/employee/fees" className="btn btn-link nav-link">
          Rental Fees
        </Link>
        <Link to="/employee/vehicles" className="btn btn-link nav-link">
          Vehicles
        </Link>
        <Link to="/employee/users" className="btn btn-link nav-link">
          Users
        </Link>
      </ul>
    </div>
  );
};

export default Navbar;