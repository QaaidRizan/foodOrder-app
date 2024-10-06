import React, { useContext, useState } from "react";
import './LoginPopUp.css';
import { assets } from "../../assets/assets";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { StoreContext } from '../../Context/StoreContext'; // Ensure this path is correct

const LoginPopUp = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const { setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login"); // Tracks whether the form is in "Login" or "Sign Up" state
  const [email, setEmail] = useState(""); // Stores email input
  const [password, setPassword] = useState(""); // Stores password input
  const [name, setName] = useState(""); // Only used during "Sign Up"
  const [errorMessage, setErrorMessage] = useState(""); // Displays error messages
  const [termsAccepted, setTermsAccepted] = useState(false); // Tracks checkbox for terms acceptance

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Ensure all fields are filled in and terms are accepted
    if (!email || !password || (currState === "Sign Up" && !name)) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (!termsAccepted) {
      setErrorMessage("You must agree to the terms to continue.");
      return;
    }

    try {
      if (currState === "Login") {
        // Login request
        const response = await axios.post(
          "http://localhost:8082/db-api/users/login",
          {
            email,
            password,
          }
        );

        if (response.status === 200) {
          alert("Login successful!");
          Cookies.set("userId", response.data.userId); // Remove expiration
          Cookies.set("email", response.data.email); // Remove expiration
          setToken(response.data.email);
          setShowLogin(false);

          // Force a page reload to reflect changes
          window.location.reload();
        } else {
          setErrorMessage("Invalid credentials, please try again");
        }
      } else {
        // Sign Up request (assuming the backend supports a POST request for user registration)
        const response = await axios.post(
          "http://localhost:8082/db-api/users/signup",
          {
            name,
            email,
            password,
          }
        );

        // Handle response for sign-up
        if (response.status === 200) {
          alert("Sign-up successful!");
          setShowLogin(false);
        } else {
          setErrorMessage(
            response.data.message || "Sign-up failed, please try again"
          );
        }
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">
          {currState === "Sign Up" ? "Create account" : "Login"}
        </button>

        <div className="login-popup-condition">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            required
          />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {currState === "Login" ? (
          <p>
            Create account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopUp;
