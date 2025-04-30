import React, { useState } from "react";
import "./homepage.css";

/**
 * JoinForm Component
 * 
 * A React functional component that renders a membership form for users to join a club.
 * The form collects various personal and club-related details from the user.
 * 
 * @component
 * @param {Object} props - The props object.
 * @param {Function} props.onClose - Callback function to close the form after submission.
 * 
 * @returns {JSX.Element} The rendered JoinForm component.
 * 
 * @example
 * <JoinForm onClose={() => console.log('Form closed')} />
 * 
 * @description
 * The form includes fields for:
 * - Name, Surname, Age, Address, School Name, Grade
 * - Previous Club, Position, Email, Phone
 * - Reason for leaving the previous club
 * 
 * The component uses the `useState` hook to manage form data and updates the state
 * on input changes. On form submission, the data is logged to the console and the
 * `onClose` callback is triggered.
 */

export default function JoinForm({ onClose }) {
  // State to manage form data
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    nationality: "",
    id_number: "",
    gender: "",
    school: "",
    previous_club: "",
    years_of_training: 0,
    age_group: "U12",
    position: "",
    mother_name: "",
    mother_phone: "",
    mother_email: "",
    father_name: "",
    father_phone: "",
    father_email: "",
  });

  /**
   * Handles input changes and updates the form data state.
   * @param {Object} e - The event object from the input field.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * Handles form submission.
   * Logs the form data and triggers the onClose callback.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    onClose(); // Close the form after submission
  };

  return (
    <div className="join-form active" id="joinForm">
      <form id="membershipForm" onSubmit={handleSubmit}>
        {/* Name Input */}
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        {/* Surname Input */}
        <label htmlFor="surname">Surname</label>
        <input
          type="text"
          id="surname"
          name="surname"
          value={formData.surname}
          onChange={handleInputChange}
          required
        />

        {/* Age Input */}
        <label htmlFor="age">Age</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          min="8"
          max="23"
          required
        />

        {/* Address Input */}
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />

        {/* School Name Input */}
        <label htmlFor="school-name">School Name</label>
        <input
          type="text"
          id="school-name"
          name="schoolName"
          value={formData.schoolName}
          onChange={handleInputChange}
          required
        />

        {/* Grade Input */}
        <label htmlFor="grade">Grade</label>
        <input
          type="number"
          id="grade"
          name="grade"
          value={formData.grade}
          onChange={handleInputChange}
          max="12"
          required
        />

        {/* Previous Club Input */}
        <label htmlFor="previous-club">Previous Club</label>
        <input
          type="text"
          id="previous-club"
          name="previousClub"
          value={formData.previousClub}
          onChange={handleInputChange}
          required
        />

        {/* Position Dropdown */}
        <label htmlFor="position">Position</label>
        <input
          type="text"
          id="position"
          name="position"
          value={formData.position}
          onChange={handleInputChange}
          />

        {/* Email Input */}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        {/* Phone Input */}
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />

        {/* Reason for Leaving Previous Club */}
        <label htmlFor="migrate-reason">Reason for leaving your previous club</label>
        <textarea
          id="migrate-reason"
          name="migrateReason"
          value={formData.migrateReason}
          onChange={handleInputChange}
          rows="4"
        />

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}