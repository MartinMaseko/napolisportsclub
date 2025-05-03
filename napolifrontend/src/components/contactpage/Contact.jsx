import React, { useState } from 'react';
import emailjs from "emailjs-com";
import './contact.css';
import Footer from '../footer/Footer.jsx';

/**
 * ContactPage Component
 * 
 * This component renders a contact form where users can input their name, phone number, email, and message.
 * It includes a WhatsApp contact link and a submit button to handle form submissions.
 * 
 * Features:
 * - Form state management using React's useState hook.
 * - Input fields for name, phone, email, and message.
 * - Form submission handler that logs the form data and resets the form fields.
 * - WhatsApp contact link with an icon.
 * - Footer section included at the bottom of the page.
 * 
 * @component
 * @returns {JSX.Element} The rendered ContactPage component.
 */

export default function ContactPage() {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  // State to manage submission status
  const [submissionStatus, setSubmissionStatus] = useState("");

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

    // EmailJS configuration
    const serviceID = "service_kcrc171"; // EmailJS Service ID
    const templateID = "template_ta476tf"; // EmailJS Template ID
    const userID = "Lpe2o5Y0d-HrJ4w4J"; // EmailJS User ID

    emailjs
      .send(serviceID, templateID, formData, userID)
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setSubmissionStatus("success");
          // Reset the form fields after submission
          setFormData({
            name: "",
            phone: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          console.error("FAILED...", error);
          setSubmissionStatus("error");
        }
      );
  };

  return (
    <div className="dark-page">
      {/* Contact Section */}
      <div className="contact-section">
        <h1>Contact Us</h1>
        <form id="contactForm" onSubmit={handleSubmit}>
          {/* Name Field */}
          <h3 htmlFor="name">Name</h3>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />

          {/* Phone Number Field */}
          <h3 htmlFor="phone">Phone Number</h3>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />

          {/* Email Field */}
          <h3 htmlFor="email">Email</h3>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          {/* Message Field */}
          <h3 htmlFor="message">Message</h3>
          <textarea
            id="message"
            name="message"
            rows="4"
            cols="50"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your message"
          />

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

          {/* Submit Button */}
          <button id='contactform-submitbtn' type="submit">Submit</button>
        </form>
        {/* Success Message */}
        {submissionStatus === "success" && (
            <p className="email-report">
              Thank you for reaching out, we will be in contact with you soon.
            </p>
          )}

          {/* Error Message */}
          {submissionStatus === "error" && (
            <p className="email-report">
              Failed to send the message. Please try again later.
            </p>
          )}
      </div>

      {/* Footer Section */}
      <div className="club-footer-container">
        <Footer />
      </div>
    </div>
  );
}