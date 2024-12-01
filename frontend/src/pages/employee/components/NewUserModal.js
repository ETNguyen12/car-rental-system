import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewUserModal = ({ show, onClose, onSave }) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    birth_date: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    zip_code: "",
    license_number: "",
    policy_number: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateSection = () => {
    const requiredFields = {
      1: ["first_name", "last_name", "email", "phone_number"],
      2: ["address_line1", "city", "state", "zip_code"],
      3: ["birth_date", "license_number", "policy_number"],
    };

    const fieldsToValidate = requiredFields[currentSection];
    for (const field of fieldsToValidate) {
      if (!formData[field]) {
        toast.error(`Please fill out the required field: ${field.replace("_", " ")}`);
        return false;
      }
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
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      birth_date: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      zip_code: "",
      license_number: "",
      policy_number: "",
    });
    setCurrentSection(1); 
    onClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Section 1: Personal Information */}
          {currentSection === 1 && (
            <>
              <h5 className="mb-3">Personal Information</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      First Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Last Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Phone Number <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </>
          )}

          {/* Section 2: Address Information */}
          {currentSection === 2 && (
            <>
              <h5 className="mb-3">Address Information</h5>
              <Form.Group className="mb-3">
                <Form.Label>
                  Address Line 1 <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address Line 2 (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="address_line2"
                  value={formData.address_line2}
                  onChange={handleChange}
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      City <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      State <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {[
                        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
                        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
                        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
                        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
                        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
                      ].map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Zip Code <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}

          {/* Section 3: Additional Details */}
          {currentSection === 3 && (
            <>
              <h5 className="mb-3">Additional Details</h5>
              <Form.Group className="mb-3">
                <Form.Label>
                  Birth Date <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  License Number <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Policy Number <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="policy_number"
                  value={formData.policy_number}
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

export default NewUserModal;