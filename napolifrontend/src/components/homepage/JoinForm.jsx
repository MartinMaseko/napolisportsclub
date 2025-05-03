import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import "./homepage.css";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function JoinForm({ onClose }) {
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
   * Sends the form data to Firebase.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newRegistrationRef = ref(database, "newRegistrations");
      const newRegistration = {
        ...formData,
      };

      await push(newRegistrationRef, newRegistration);

      alert("Registration submitted successfully!");
      setFormData({
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
      onClose();
    } catch (error) {
      console.error("Error submitting registration:", error);
      alert("Failed to submit registration. Please try again.");
    }
  };

  return (
    <div className="join-form active" id="joinForm">
      <form id="membershipForm" onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
          required
        />

        <label>Last Name:</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
          required
        />

        <label>Nationality:</label>
        <input
          type="text"
          name="nationality"
          value={formData.nationality}
          onChange={handleInputChange}
        />

        <label>ID Number:</label>
        <input
          type="text"
          name="id_number"
          value={formData.id_number}
          onChange={handleInputChange}
          required
        />

        <label>Gender:</label>
        <input
          type="text"
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
        />

        <label>School:</label>
        <input
          type="text"
          name="school"
          value={formData.school}
          onChange={handleInputChange}
        />

        <label>Previous Club:</label>
        <input
          type="text"
          name="previous_club"
          value={formData.previous_club}
          onChange={handleInputChange}
        />

        <label>Years of Training:</label>
        <input
          type="number"
          name="years_of_training"
          value={formData.years_of_training}
          onChange={handleInputChange}
        />

        <label>Age Group:</label>
        <select
          name="age_group"
          value={formData.age_group}
          onChange={handleInputChange}
          required
        >
          <option value="U12">U12</option>
          <option value="U14">U14</option>
          <option value="U17">U17</option>
          <option value="SENIOR">SENIOR</option>
        </select>

        <label>Position:</label>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleInputChange}
        />
        
        <label>Mother's Name:</label>
        <input
          type="text"
          name="mother_name"
          value={formData.mother_name}
          onChange={handleInputChange}
        />

        <label>Mother's Phone:</label>
        <input
          type="text"
          name="mother_phone"
          value={formData.mother_phone}
          onChange={handleInputChange}
        />

        <label>Mother's Email:</label>
        <input
          type="email"
          name="mother_email"
          value={formData.mother_email}
          onChange={handleInputChange}
        />

        <label>Father's Name:</label>
        <input
          type="text"
          name="father_name"
          value={formData.father_name}
          onChange={handleInputChange}
        />

        <label>Father's Phone:</label>
        <input
          type="text"
          name="father_phone"
          value={formData.father_phone}
          onChange={handleInputChange}
        />

        <label>Father's Email:</label>
        <input
          type="email"
          name="father_email"
          value={formData.father_email}
          onChange={handleInputChange}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}