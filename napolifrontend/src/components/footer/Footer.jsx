import React from "react";
import "./footer.css";
import ErrorBoundary from "./ErrorBounary";

/**
 * Footer Component
 * Displays the footer section with contact details, address, and social media links.
 */
export default function Footer() {
  return (
    <>
      <footer>
        {/* Contact Information Section */}
        <div className="contact-info">
          <h2>Contact Details</h2>

          {/* Club operating times */}
          <h3>Club Times:</h3>
          <p>Mon | Wed | Fri 16:00 - 18:00</p>

          {/* Phone numbers */}
          <h3>Phone:</h3>
          <p className="text-bold">
            <a href="tel:+27616698644">🤙🏽 061 669 8644</a>  |  <a href="tel:+27737378310">🤙🏽 073 737 8310</a>
          </p>
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
                width="40" 
                height="40" 
                src="https://img.icons8.com/fluency/40/instagram-new.png" 
                alt="instagram-new"
                />
            </a>

            {/* Email link */}
            <a href="mailto:info@napolijhb.co.za">
              <img 
                id="footer-icons"
                width="40" 
                height="40" 
                src="https://img.icons8.com/fluency/40/new-post.png" 
                alt="new-post"
                />
            </a>
          </div>

          {/* Address with Google Maps link */}
          <h3>Address:</h3>
          <h4>NorthCliff Primary School</h4>
          <ErrorBoundary>
            <iframe
              className="map-iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.7428820999025!2d27.955705074402722!3d-26.13992516135731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950acf92315e8d%3A0xc1247a0245f0145b!2s176%20Weltevreden%20Rd%2C%20Northcliff%2C%20Randburg%2C%202115!5e0!3m2!1sen!2sza!4v1745791535286!5m2!1sen!2sza"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps location of NorthCliff Primary School"
            />
          </ErrorBoundary>
        </div>
      </footer>
    </>
  );
}