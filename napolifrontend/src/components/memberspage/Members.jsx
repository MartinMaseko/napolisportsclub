import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./members.css";
import mobileBanner from "./assests/mobile-ad-banner.png";
import pcBanner from "./assests/pc-banner.png";

/**
 * Members Component
 * 
 * This component renders a login form for members to authenticate and access their respective dashboards.
 * It includes input fields for username and password, handles form submission, and redirects users based on their roles.
 * 
 * State Variables:
 * - `formData`: Manages the input values for username and password.
 * - `error`: Stores error messages for validation or login failures.
 * 
 * Functions:
 * - `handleChange`: Updates the `formData` state when input fields change and clears any existing error messages.
 * - `handleSubmit`: Validates the form, sends a login request to the backend, stores user details in localStorage, 
 *   and redirects users to their respective dashboards based on their roles.
 * 
 * Dependencies:
 * - `axios`: Used for making HTTP requests to the backend API.
 * - `useNavigate`: React Router's hook for navigation.
 * 
 * Props: None
 * 
 * Returns:
 * - A JSX structure containing the login form, error messages, and a WhatsApp contact link.
 */

export default function Members() {
  // State to manage form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // State to manage error messages
  const [error, setError] = useState("");

  // React Router's navigate function for redirection
  const navigate = useNavigate();

  /**
   * Handles input changes and updates the form data state.
   * @param {Object} e - The event object from the input field.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error message on input change
  };

  /**
   * Handles form submission for login.
   * Validates the input fields, sends a login request, and redirects based on the user's role.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form fields
    if (!formData.username || !formData.password) {
      setError("Username and password are required.");
      return;
    }

    try {
      // Send login request to the backend
      const response = await axios.post(
        "https://MartinMaseko.pythonanywhere.com/api/login/",
        {
          username: formData.username,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Extract data from the response
      const { token, role, first_name: firstName, last_name: lastName } = response.data;

      // Store the token and user details in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("username", formData.username); // Store the username (used as ID number)
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      localStorage.setItem("role", role);

      // Navigate to the appropriate dashboard based on the user's role
      if (role === "manager") {
        navigate(`/managersdashboard?username=${encodeURIComponent(formData.username)}`);
      } else if (role === "player") {
        navigate(`/playersdashboard?username=${encodeURIComponent(firstName)}`);
      } else {
        setError("Access restricted.");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Incorrect username or password.");
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="members-header">
        <img src={pcBanner} alt="PC banner" className="pc-banner" />
        <img src={mobileBanner} alt="Mobile banner" className="mobile-banner" />

        {/* Login Form Section */}
        <div className="login-container">
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="member-header">
              <img
                id="member-icon"
                src="https://img.icons8.com/?size=100&id=XOn9u5ajbq8a&format=png&color=000000"
                alt="Profile icon"
              />
              <h2>Members Login</h2>
            </div>

            {/* Username Input */}
            <input
              type="text"
              id="login-username"
              name="username"
              placeholder="Username"
              required
              value={formData.username}
              onChange={handleChange}
            />

            {/* Password Input */}
            <input
              type="password"
              id="login-password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
            />

            {/* Submit Button */}
            <button type="submit" id="memberLogin">
              Login
            </button>

            {/* Error Message */}
            <p id="error" className="error-message">
              {error}
            </p>
          </form>

          {/* WhatsApp Contact Link */}
            <a
              href="https://wa.me/+27737378310"
              aria-label="Contact us on WhatsApp"
            >
              <img
                id="whatsapp-icon"
                width="40"
                height="40"
                src="https://img.icons8.com/fluency/40/whatsapp.png"
                alt="WhatsApp icon"
              />
            </a>
        </div>
      </div>
    </>
  );
}