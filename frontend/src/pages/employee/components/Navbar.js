import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const navLinkStyle = {
    display: "block",
    textAlign: "center",
    padding: "10px 0",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: 500,
    color: "#007bff",
    transition: "background-color 0.3s ease, color 0.3s ease",
  };

  const activeLinkStyle = {
    backgroundColor: "#007bff", 
    color: "#ffffff",
  };

  return (
    <div
      className="bg-white shadow-sm"
      style={{ width: "10%", minWidth: "150px" }}
    >
      <div className="border-bottom table_name text-center">
        <img src="https://static.thenounproject.com/png/386502-200.png" alt="logo" style={{width: '50px', height: '50px', margin: '10px 0px'}}></img>
      </div>

      {/* Navigation Links */}
      <ul
        style={{
          listStyleType: "none",
          padding: 0,
          margin: "20px 0 0 0",
        }}
      >
        <NavLink
          to="/employee/rentals"
          style={({ isActive }) =>
            isActive
              ? { ...navLinkStyle, ...activeLinkStyle }
              : navLinkStyle
          }
        >
          Rentals
        </NavLink>
        <NavLink
          to="/employee/fees"
          style={({ isActive }) =>
            isActive
              ? { ...navLinkStyle, ...activeLinkStyle }
              : navLinkStyle
          }
        >
          Rental Fees
        </NavLink>
        <NavLink
          to="/employee/vehicles"
          style={({ isActive }) =>
            isActive
              ? { ...navLinkStyle, ...activeLinkStyle }
              : navLinkStyle
          }
        >
          Vehicles
        </NavLink>
        <NavLink
          to="/employee/users"
          style={({ isActive }) =>
            isActive
              ? { ...navLinkStyle, ...activeLinkStyle }
              : navLinkStyle
          }
        >
          Users
        </NavLink>
      </ul>
    </div>
  );
};

export default Navbar;