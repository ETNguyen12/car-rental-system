import React from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthMain } from './pages/auth';
import { RentalMain, FeeMain, VehicleMain, UserMain } from './pages/employee';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<RentalMain />} />
          <Route path="/employee/rentals" element={<RentalMain />} />
          <Route path="/employee/fees" element={<FeeMain />} /> 
          <Route path="/employee/vehicles" element={<VehicleMain />} /> 
          <Route path="/employee/users" element={<UserMain />} /> 
          <Route path="/auth" element={<AuthMain />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;