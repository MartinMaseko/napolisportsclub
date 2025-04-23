import React, { useState } from 'react';
import './contact.css';
import Footer from '../footer/Footer.jsx';

/**
 * ContactPage Component
 * Renders a contact form for users to submit their details and message.
 * Includes a WhatsApp link and a footer.
 */
export default function ContactPage() {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  /**
   * Handles input changes in the form.
   * Updates the corresponding field in the formData state.
   * @param {Object} e - The event object from the input field.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Handles form submission.
   * Logs the form data and resets the form fields.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Replace with API call logic if needed

    // Reset the form fields after submission
    setFormData({
      name: '',
      phone: '',
      email: '',
      message: '',
    });
  };

  return (
    <div className="dark-page">
      {/* Contact Section */}
      <div className="contact-section">
        <h1>Contact Us</h1>
        <form id="contactForm" onSubmit={handleSubmit}>
          {/* Name Field */}
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />

          {/* Phone Number Field */}
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />

          {/* Email Field */}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          {/* Message Field */}
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            cols="50"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your message"
          />

          {/* WhatsApp Link */}
          <a href="https://wa.me/+27737378310" aria-label="Contact us on WhatsApp">
            <img
              id="whatsapp-icon"
              src="https://img.icons8.com/ios-filled/40/228BE6/whatsapp--v1.png"
              alt="WhatsApp Icon"
            />
          </a>

          {/* Submit Button */}
          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Footer Section */}
      <div className="club-footer-container">
        <Footer />
      </div>
    </div>
  );
}