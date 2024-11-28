import React from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StartImage from './components/StartImage'; 
import { CustomerMain } from './pages/customer';
import { ManagerMain } from './pages/manager';

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
                    <Link to="/customer">Customer Page</Link>
                  </nav>
                  <nav>
                    <Link to="/manager">Manager Page</Link>
                  </nav>
                </header>
              </div>
            </>
          }
        />
        <Route path="/customer" element={<CustomerMain />} />
        <Route path="/manager" element={<ManagerMain />} />
      </Routes>
    </Router>
  );
}

export default App;