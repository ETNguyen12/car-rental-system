import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewVehicleModal = ({ show, onClose, onSave }) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    color: "",
    type: "",
    year: "",
    make: "",
    model: "",
    vin: "",
    license_plate: "",
    fuel: "",
    seat_capacity: "",
    odometer_reading: "",
    maintenance_due_date: "",
    daily_rental_rate: "",
    status: "Available", 
  });

  const vehicleTypes = [
    "Coupe",
    "Sedan",
    "SUV",
    "Mini Van",
    "Van",
    "Truck",
    "Other",
  ];

  const fuelTypes = [
    "Gasoline",
    "Diesel",
    "Electric",
    "Hybrid",
  ];

  const tomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateSection = () => {
    const requiredFields = {
      1: ["color", "type", "year", "make", "model"],
      2: ["vin", "license_plate", "fuel", "seat_capacity", "odometer_reading"],
      3: ["maintenance_due_date", "daily_rental_rate"],
    };

    const fieldsToValidate = requiredFields[currentSection];
    for (const field of fieldsToValidate) {
      if (!formData[field]) {
        toast.error(`Please fill out the required field: ${field.replace("_", " ")}`);
        return false;
      }
    }

    if (currentSection === 2 && formData.seat_capacity <= 0) {
      toast.error("Seat capacity must be greater than 0.");
      return false;
    }

    if (currentSection === 2 && formData.odometer_reading < 0) {
      toast.error("Odometer reading must be 0 or greater.");
      return false;
    }

    if (currentSection === 3 && formData.maintenance_due_date <= tomorrowDate) {
      toast.error("Maintenance due date must be in the future.");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateSection()) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentSection((prev) => prev - 1);
  };

  const handleSave = () => {
    if (validateSection()) {
      onSave(formData);
      handleModalClose();
    }
  };

  const handleModalClose = () => {
    setFormData({
      color: "",
      type: "",
      year: "",
      make: "",
      model: "",
      vin: "",
      license_plate: "",
      fuel: "",
      seat_capacity: "",
      odometer_reading: "",
      maintenance_due_date: "",
      daily_rental_rate: "",
      status: "Available",
    });
    setCurrentSection(1);
    onClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Vehicle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Section 1: Basic Information */}
          {currentSection === 1 && (
            <>
              <h5 className="mb-3">Basic Information</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Color <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Type <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select Vehicle Type
                      </option>
                      {vehicleTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Year <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Make <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Model <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}

          {/* Section 2: Vehicle Details */}
          {currentSection === 2 && (
            <>
              <h5 className="mb-3">Vehicle Details</h5>
              <Form.Group className="mb-3">
                <Form.Label>
                  VIN <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  License Plate <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="license_plate"
                  value={formData.license_plate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Fuel Type <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="fuel"
                      value={formData.fuel}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select Fuel Type
                      </option>
                      {fuelTypes.map((fuel) => (
                        <option key={fuel} value={fuel}>
                          {fuel}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Seat Capacity <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="seat_capacity"
                      value={formData.seat_capacity}
                      min={0} 
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>
                  Odometer Reading <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="odometer_reading"
                  value={formData.odometer_reading}
                  min={0} 
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </>
          )}

          {/* Section 3: Additional Details */}
          {currentSection === 3 && (
            <>
              <h5 className="mb-3">Additional Details</h5>
              <Form.Group className="mb-3">
                <Form.Label>
                  Maintenance Due Date <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="maintenance_due_date"
                  value={formData.maintenance_due_date}
                  min={tomorrowDate} 
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Daily Rental Rate <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="daily_rental_rate"
                  value={formData.daily_rental_rate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {currentSection > 1 && (
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
        )}
        {currentSection < 3 && (
          <Button variant="primary" onClick={handleNext}>
            Next
          </Button>
        )}
        {currentSection === 3 && (
          <Button variant="success" onClick={handleSave}>
            Save
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default NewVehicleModal;