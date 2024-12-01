import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div
      className="bg-white shadow-sm"
      style={{ width: "10%", minWidth: "150px" }}
    >
      <div className="border-bottom table_name text-center">
        <img src="https://static.thenounproject.com/png/386502-200.png" alt="logo" style={{width: '50px', height: '50px', margin: '10px 0px'}}></img>
      </div>
      <ul className="nav flex-column">
        <Link to="/employee/rentals" className="btn btn-link nav-link">
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