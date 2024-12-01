import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

const NewFeeModal = ({ show, onClose, fetchFees }) => {
  const [customers, setCustomers] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [newFee, setNewFee] = useState({
    rental_id: "",
    customer_id: "",
    customer_name: "",
    type: "",
    description: "",
    amount: "",
    status: "Unpaid",
    due_date: "",
  });

  const feeTypes = [
    "Damage", 
    "Late", 
    "Cleaning"
  ];
  const [customerSearch, setCustomerSearch] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);

  const tomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (newFee.customer_id) return;

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
  }, [customerSearch, newFee.customer_id]);

  useEffect(() => {
    if (currentStep === 2 && newFee.customer_id) {
      const fetchRentals = async () => {
        try {
          const response = await api.get(`/employee/rentals?customer_id=${newFee.customer_id}`);
          setRentals(response.data);
        } catch (error) {
          console.error("Error fetching rentals:", error);
          toast.error("Failed to fetch rentals for the selected customer.");
        }
      };

      fetchRentals();
    }
  }, [currentStep, newFee.customer_id]);

  const handleCustomerSearch = (e) => {
    const value = e.target.value;
    setCustomerSearch(value);
    setNewFee((prev) => ({
      ...prev,
      customer_id: "",
      customer_name: "",
    }));
  };

  const handleCustomerSelect = (customer) => {
    setNewFee((prev) => ({
      ...prev,
      customer_id: customer.id,
      customer_name: customer.name,
    }));
    setShowDropdown(false);
    setCustomerSearch(customer.name);
  };

  const handleRentalSelect = (e) => {
    setNewFee((prev) => ({ ...prev, rental_id: e.target.value }));
  };

  const handleAddFee = async () => {
    if (newFee.amount <= 0) {
      toast.error("Amount must be greater than 0.");
      return;
    }

    const payload = {
      rental_id: newFee.rental_id,
      type: newFee.type,
      description: newFee.description,
      amount: parseFloat(newFee.amount),
      status: newFee.status,
      due_date: newFee.due_date,
    };

    try {
      const response = await api.post("/employee/fees/create", payload);
      if (response.status === 201) {
        toast.success("Fee created successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        setNewFee({
          rental_id: "",
          customer_id: "",
          customer_name: "",
          type: "",
          description: "",
          amount: "",
          status: "Unpaid",
          due_date: "",
        });
        setCustomerSearch("");
        setCustomers([]);
        setRentals([]);
        setCurrentStep(1);
        fetchFees();
        onClose();
      } else {
        toast.error(response.data.error || "Failed to create fee.");
      }
    } catch (error) {
      console.error("Error creating fee:", error);
      toast.error("Failed to create fee. Please try again.");
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!newFee.customer_id) {
        toast.error("Please select a customer.");
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${month}/${day}/${year}`;
  };

  return (
    <>
      <ToastContainer />
      <Modal show={show} onHide={onClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Fee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
            </form>
          )}

          {currentStep === 2 && (
            <form>
              <div className="mb-3">
                <label className="form-label">Rental</label>
                <select
                  className="form-control"
                  name="rental_id"
                  value={newFee.rental_id}
                  onChange={handleRentalSelect}
                >
                  <option value="" disabled hidden>
                    Select Rental
                  </option>
                  {rentals.length > 0 ? (
                    rentals.map((rental) => (
                      <option key={rental.id} value={rental.id}>
                        {rental.vehicle} ({formatDate(rental.pickup_date)} - {formatDate(rental.dropoff_date)})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No completed rentals found for this customer.
                    </option>
                  )}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Type</label>
                <select
                  className="form-control"
                  name="type"
                  value={newFee.type}
                  onChange={(e) => setNewFee({ ...newFee, type: e.target.value })}
                >
                  <option value="" disabled hidden>
                    Select Fee Type
                  </option>
                  {feeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={newFee.description}
                  onChange={(e) => setNewFee({ ...newFee, description: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-control"
                  name="amount"
                  value={newFee.amount}
                  min={1}
                  onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="due_date"
                  value={newFee.due_date}
                  min={tomorrowDate()}
                  onChange={(e) => setNewFee({ ...newFee, due_date: e.target.value })}
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
              onClick={handleAddFee}
              disabled={!newFee.rental_id || !newFee.type || !newFee.amount || !newFee.due_date}
            >
              Add Fee
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NewFeeModal;