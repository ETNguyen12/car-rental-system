import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import NewUserModal from "./NewUserModal";

const NewRentalModal = ({ show, onClose, fetchRentals }) => {
    const initialRentalState = {
      customer_id: "",
      customer_name: "",
      vehicle_id: "",
      pickup_date: "",
      dropoff_date: "",
      odometer_before: 0,
      odometer_after: null,
      total_price: 0,
      status: "Unpaid",
    };

    const [customers, setCustomers] = useState([]);
    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [newRental, setNewRental] = useState(initialRentalState);
    const [customerSearch, setCustomerSearch] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const [showDropdown, setShowDropdown] = useState(false);
    const [noVehiclesMessage, setNoVehiclesMessage] = useState(false);
    const [showNewUserModal, setShowNewUserModal] = useState(false);

    const handleCloseModal = () => {
      setNewRental(initialRentalState);
      setCustomerSearch("");
      setCustomers([]);
      setAvailableVehicles([]);
      setNoVehiclesMessage(false);
      setCurrentStep(1);
      onClose();
    };

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
    const totalPrice = 1.0725 * days * selectedVehicle.daily_rental_rate;
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
        onClose();
        fetchRentals();

        toast.success("Rental created successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

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
        setCurrentStep(1);
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

  const onSaveUser = async (userData) => {
    try {
      const response = await api.post("/auth/customers/create", userData); 
      if (response.status === 201) {
        toast.success("User added successfully!");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to save user.");
    }
  };

  const handleNewUser = (newUserData) => {
    onSaveUser(newUserData);
    setShowNewUserModal(false);
    setCustomerSearch(newUserData.name);
    setNewRental((prev) => ({
      ...prev,
      customer_id: newUserData.id,
      customer_name: newUserData.name,
    }));
  };

  return (
    <>
      <ToastContainer />
      <Modal show={show} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Rental</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentStep === 1 && (
            <form>
              <div className="mb-3 position-relative">
                <label className="form-label">
                  Customer{" "}
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    style={{ fontSize: "0.9rem" }}
                    onClick={() => setShowNewUserModal(true)}
                  >
                    New?
                  </button>
                </label>
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

              {newRental.customer_id && (
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
                <label className="form-label">Total Price (Tax Included)</label>
                <input
                  type="text"
                  className="form-control"
                  value={`$${newRental.total_price}`}
                  readOnly
                />
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          {currentStep > 1 && (
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
          )}
          {currentStep < 2 && (
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          )}
          {currentStep === 2 && (
            <Button
              variant="primary"
              onClick={handleAddRental}
              disabled={!newRental.vehicle_id || noVehiclesMessage}
            >
              Add Rental
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <NewUserModal
        show={showNewUserModal}
        onClose={() => setShowNewUserModal(false)}
        onSave={handleNewUser}
      />
    </>
  );
};

export default NewRentalModal;