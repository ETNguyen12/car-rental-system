import { useState } from "react";
import api from "../../services/api"; // Axios instance with base URL
import FormField from "./components/FormField";
import FormStep from "./components/FormStep";
import StateDropdown from "./components/StateDropdown";

function AuthMain() {
  const [isLoginMode, setIsLoginMode] = useState(true); // Toggle between login and signup
  const [step, setStep] = useState(1); // Step state for signup
  const [error, setError] = useState(null); // Error state

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    zip_code: "",
    birth_date: "",
    license_number: "",
    policy_number: "",
  });

  // Dismiss error after 5 seconds
  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", loginData);
      console.log("Login successful:", response.data);
    } catch (err) {
      console.error("Login error:", err);
      showError("Failed to log in. Please check your credentials.");
    }
  };

  // Handle registration submission
  const handleRegister = async () => {
    try {
      const response = await api.post("/auth/signup", signupData);
      console.log("Registration successful:", response.data);
      setIsLoginMode(true); // Switch to login mode after successful signup
      setSignupData({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        password: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        zip_code: "",
        birth_date: "",
        license_number: "",
        policy_number: "",
      });
    } catch (err) {
      console.error("Registration error:", err);
      showError("Failed to register. Please try again.");
    }
  };

  // Step navigation
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Toggle between login and register modes
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError(null);
    setStep(1); // Reset to the first step when switching modes
    if (!isLoginMode) {
      // Clear signup data when switching back to login mode
      setSignupData({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        password: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        zip_code: "",
        birth_date: "",
        license_number: "",
        policy_number: "",
      });
    }
  };

  // Fields for each signup step
  const steps = [
    {
      fields: [
        { id: "first_name", label: "First Name", type: "text", required: true },
        { id: "last_name", label: "Last Name", type: "text", required: true },
        { id: "email", label: "Email", type: "email", required: true },
        { id: "password", label: "Password", type: "password", required: true },
      ],
    },
    {
      fields: [
        { id: "address_line1", label: "Address Line 1", type: "text", required: true },
        { id: "address_line2", label: "Address Line 2", type: "text", required: false },
        { id: "city", label: "City", type: "text", required: true },
        {
          id: "state",
          label: "State",
          type: "custom",
          component: StateDropdown,
          required: true,
        },
        { id: "zip_code", label: "Zip Code", type: "text", required: true },
      ],
    },
    {
      fields: [
        { id: "phone_number", label: "Phone Number", type: "text", required: true },
        { id: "birth_date", label: "Birth Date", type: "date", required: true },
        { id: "license_number", label: "License Number", type: "text", required: true },
        { id: "policy_number", label: "Policy Number", type: "text", required: false },
      ],
    },
  ];

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mb-4">{isLoginMode ? "Log In" : "Create an Account"}</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        {isLoginMode ? (
          <form onSubmit={handleLogin}>
            <FormField
              id="email"
              label="Email"
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            />
            <FormField
              id="password"
              label="Password"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <button type="submit" className="btn btn-primary w-100">Log In</button>
            <div className="text-center mt-3">
              <p>Don't have an account? <button type="button" className="btn btn-link" onClick={toggleMode}>Sign Up</button></p>
            </div>
          </form>
        ) : (
          <FormStep
            fields={steps[step - 1].fields}
            data={signupData}
            onChange={setSignupData}
            onNext={step === steps.length ? handleRegister : nextStep}
            onBack={step > 1 ? prevStep : null}
            isLastStep={step === steps.length}
          />
        )}

        {!isLoginMode && (
          <div className="text-center mt-3">
            <p>Already have an account? <button type="button" className="btn btn-link" onClick={toggleMode}>Log In</button></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthMain;
