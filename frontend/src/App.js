import React from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StartImage from './components/StartImage'; 
import { AuthMain } from './pages/auth';
import { EmployeeMain, FeeMain, VehicleMain, UserMain } from './pages/employee';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="container-fluid d-flex flex-column  align-items-center vh-100 pt-5">
                <StartImage height="300px" width="300px" />
                <header className="App-header mt-3">
                  <nav>
                    <Link to="/auth">Auth Page</Link>
                  </nav>
                  <nav>
                    <Link to="/employee">Employee Page</Link>
                  </nav>
                </header>
              </div>
            </>
          }
        />
        <Route path="/auth" element={<AuthMain />} />
        <Route path="/employee/" element={<EmployeeMain />} />
        <Route path="/employee/rentals" element={<EmployeeMain />} />
        <Route path="/employee/fees" element={<FeeMain />} /> 
        <Route path="/employee/vehicles" element={<VehicleMain />} /> 
        <Route path="/employee/users" element={<UserMain />} /> 
      </Routes>
    </Router>
  );
}

export default App;