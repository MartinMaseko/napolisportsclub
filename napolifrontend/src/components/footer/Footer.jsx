import React from "react";
import "./footer.css";

/**
 * Footer Component
 * Displays the footer section with contact details, address, and social media links.
 */
export default function Footer() {
  // Google Maps link for the club's address
  const googleMapsLink = "https://www.google.com/maps/place/176+Weltevreden+Road,+Northcliff,+Randburg,+2115";

  return (
    <>
      <footer>
        {/* Contact Information Section */}
        <div className="contact-info">
          <h2>Contact Details</h2>

          {/* Club operating times */}
          <h3>Club Times:</h3>
          <p>Mon - Wed 16:00 - 18:00 | Fri 16:00 - 18:00</p>

          {/* Phone numbers */}
          <h3>Phone:</h3>
          <p className="text-bold">
            <a href="tel:+27616698644">061 669 8644</a> | <a href="tel:+27737378310">073 737 8310</a>
          </p>

          {/* Address with Google Maps link */}
          <h3>Address:</h3>
          <p className="text-bold">
            <a href={googleMapsLink} target="_blank" rel="noopener noreferrer">
              176 Weltevreden Road, Northcliff, Randburg, 2115
            </a>
          </p>
        </div>

        {/* Social Media and Email Section */}
        <div className="social-icon">
          {/* Instagram link */}
          <a
            href="https://www.instagram.com/napoli_sportsclub/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              id="footer-icons"
              src="https://img.icons8.com/?size=100&id=32292&format=png&color=FFFFFF"
              alt="Instagram logo"
            />
          </a>

          {/* Email link */}
          <a href="mailto:napolijhb@gmail.com">
            <img
              id="footer-icons"
              src="https://img.icons8.com/?size=100&id=12580&format=png&color=FFFFFF"
              alt="Email logo"
            />
          </a>
        </div>
      </footer>
    </>
  );
}