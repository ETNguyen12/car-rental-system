import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import '../../../styles/employee.css';
import { toast, ToastContainer } from "react-toastify"; 

const NewRentalModal = ({ show, onClose, fetchRentals }) => {
  const [customers, setCustomers] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [newRental, setNewRental] = useState({
    customer_id: "",
    customer_name: "",
    vehicle_id: "",
    pickup_date: "",
    dropoff_date: "",
    odometer_before: 0,
    odometer_after: null,
    total_price: 0,
    status: "Pending Payment",
  });

  const [customerSearch, setCustomerSearch] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [noVehiclesMessage, setNoVehiclesMessage] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getNextDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (newRental.customer_id) return;

    const fetchCustomers = async () => {
      try {
        const response = await api.get(
          `/employee/customers?search=${encodeURIComponent(customerSearch)}`
        );
        setCustomers(response.data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    if (customerSearch) {
      fetchCustomers();
    } else {
      setCustomers([]);
      setShowDropdown(false);
    }
  }, [customerSearch, newRental.customer_id]);

  useEffect(() => {
    if (currentStep === 2 && newRental.pickup_date && newRental.dropoff_date) {
      const fetchAvailableVehicles = async () => {
        try {
          const response = await api.get(
            `/employee/vehicles?pickup_date=${newRental.pickup_date}&dropoff_date=${newRental.dropoff_date}`
          );
          setAvailableVehicles(response.data);
          setNoVehiclesMessage(response.data.length === 0);
        } catch (error) {
          console.error("Error fetching vehicles:", error);
        }
      };

      fetchAvailableVehicles();
    }
  }, [currentStep, newRental.pickup_date, newRental.dropoff_date]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;

    if (name === "pickup_date") {
      setNewRental((prev) => ({
        ...prev,
        pickup_date: value,
        dropoff_date:
          prev.dropoff_date && new Date(value) >= new Date(prev.dropoff_date)
            ? ""
            : prev.dropoff_date,
      }));
    }

    if (name === "dropoff_date") {
      setNewRental((prev) => ({ ...prev, dropoff_date: value }));
    }
  };

  const handleCustomerSearch = (e) => {
    const value = e.target.value;
    setCustomerSearch(value);
    setNewRental((prev) => ({ ...prev, customer_name: value, customer_id: "" }));
  };

  const handleCustomerSelect = (customer) => {
    setNewRental((prev) => ({
      ...prev,
      customer_id: customer.id,
      customer_name: customer.name,
    }));
    setShowDropdown(false);
    setCustomerSearch(customer.name);
  };

  const handleVehicleSelect = (e) => {
    const vehicleId = e.target.value;
    const selectedVehicle = availableVehicles.find(
      (v) => v.id === parseInt(vehicleId)
    );
    const days =
      (new Date(newRental.dropoff_date) - new Date(newRental.pickup_date)) /
      (1000 * 60 * 60 * 24);
    const totalPrice = days * selectedVehicle.daily_rental_rate;
    setNewRental((prev) => ({
      ...prev,
      vehicle_id: vehicleId,
      total_price: totalPrice.toFixed(2),
    }));
  };

  const handleAddRental = async () => {
    const payload = {
      customer_id: newRental.customer_id,
      vehicle_id: newRental.vehicle_id,
      pickup_date: newRental.pickup_date,
      dropoff_date: newRental.dropoff_date,
      odometer_before: newRental.odometer_before || 0,
      odometer_after: newRental.odometer_after,
      total_price: parseFloat(newRental.total_price) || 0,
      status: newRental.status,
    };
  
    try {
      const response = await api.post("/employee/rentals/create", payload);
      if (response.status === 201) {
        onClose(); // Close the modal immediately
        
        // Ensure fetchRentals is called after modal closes
        fetchRentals();
  
        // Show the toast after the modal is closed and rentals are refreshed
        toast.success("Rental created successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
  
        // Reset state
        setNewRental({
          customer_id: "",
          customer_name: "",
          vehicle_id: "",
          pickup_date: "",
          dropoff_date: "",
          odometer_before: 0,
          odometer_after: null,
          total_price: 0,
          status: "Pending Payment",
        });
        setCustomerSearch("");
        setCustomers([]);
        setCurrentStep(1); // Reset modal steps
      } else {
        toast.error(response.data.error || "Failed to create rental.");
      }
    } catch (error) {
      toast.error("Failed to create rental. Please try again.");
    }
  };  

  const handleNext = () => {
    if (currentStep === 1) {
      if (!newRental.customer_id || !newRental.pickup_date || !newRental.dropoff_date) {
        toast.error("Please select a customer and enter valid dates.");
        return;
      }
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!show) return null;

  return (
    <>
      <ToastContainer /> {/* Add ToastContainer to display toasts */}
      <div className="modal d-block new-rental-modal">
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "600px" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Rental</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  onClose();
                  setCurrentStep(1);
                  setNewRental({
                    customer_id: "",
                    customer_name: "",
                    vehicle_id: "",
                    pickup_date: "",
                    dropoff_date: "",
                    odometer_before: 0,
                    odometer_after: null,
                    total_price: 0,
                    status: "Pending Payment",
                  });
                  setCustomerSearch("");
                  setCustomers([]);
                }}
              ></button>
            </div>
            <div className="modal-body">
              {currentStep === 1 && (
                <form>
                  <div className="mb-3 position-relative">
                    <label className="form-label">Customer</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search customer name"
                      value={customerSearch}
                      onChange={handleCustomerSearch}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    />
                    {showDropdown && customers.length > 0 && (
                      <ul className="list-group position-absolute w-100">
                        {customers.map((customer) => (
                          <li
                            key={customer.id}
                            className="list-group-item"
                            onMouseDown={() => handleCustomerSelect(customer)}
                          >
                            {customer.name} ({customer.email})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {newRental.customer_id && ( // Show dates only if customer is selected
                    <>
                      <div className="mb-3">
                        <label className="form-label">Pickup Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="pickup_date"
                          min={getTodayDate()}
                          onChange={handleDateChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Dropoff Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="dropoff_date"
                          min={
                            newRental.pickup_date
                              ? getNextDate(newRental.pickup_date)
                              : getTodayDate()
                          }
                          onChange={handleDateChange}
                        />
                      </div>
                    </>
                  )}
                </form>
              )}

              {currentStep === 2 && (
                <form>
                  <label className="form-label">Vehicle</label>
                  {noVehiclesMessage ? (
                    <div className="alert alert-warning" role="alert">
                      No vehicles are available for the selected dates.
                    </div>
                  ) : (
                    <select
                      className="form-control"
                      name="vehicle_id"
                      value={newRental.vehicle_id}
                      onChange={handleVehicleSelect}
                    >
                      <option value="" disabled hidden>
                        Select Vehicle
                      </option>
                      {availableVehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.model} (${vehicle.daily_rental_rate}/day)
                        </option>
                      ))}
                    </select>
                  )}

                  <div
                    className={`mb-3 mt-3 ${
                      !newRental.vehicle_id ? "hidden-total-price" : ""
                    }`}
                  >
                    <label className="form-label">Total Price</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`$${newRental.total_price}`}
                      readOnly
                    />
                  </div>
                </form>
              )}
            </div>
            <div className="modal-footer">
              {currentStep > 1 && (
                <button type="button" className="btn btn-secondary" onClick={handleBack}>
                  Back
                </button>
              )}
              {currentStep < 2 && (
                <button type="button" className="btn btn-primary" onClick={handleNext}>
                  Next
                </button>
              )}
              {currentStep === 2 && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddRental}
                  disabled={!newRental.vehicle_id || noVehiclesMessage}
                >
                  Add Rental
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewRentalModal;
