import React from "react";
import "./membership.css";
import Footer from "../footer/Footer";
import img01 from "../assets/img10.png";
import img02 from "../assets/img4.jpg";
import img03 from "../assets/img12.png";
import img04 from "../assets/img13.png";

/**
 * Membership Component
 * Displays the benefits of membership in a grid format and includes a WhatsApp contact link.
 */
export default function Membership() {
  return (
    <>
      {/* Membership Benefits Section */}
      <div className="membership-container">
        <div className="membership-points">
          <div className="membership-grid">
            {/* Grid Item 1: Training Programs */}
            <div className="grid-item">
              <div
                className="grid-image"
                style={{ backgroundImage: `url(${img01})` }}
              ></div>
              <div className="grid-text">
                Excellent Training Programs using modern equipment 3 times a week.
              </div>
            </div>

            {/* Grid Item 2: Fitness Training */}
            <div className="grid-item">
              <div
                className="grid-image"
                style={{ backgroundImage: `url(${img02})` }}
              ></div>
              <div className="grid-text">Fitness Training.</div>
            </div>

            {/* Grid Item 3: Games and Tournaments */}
            <div className="grid-item">
              <div
                className="grid-image"
                style={{ backgroundImage: `url(${img03})` }}
              ></div>
              <div className="grid-text">
                League Games | Tournaments | Cup games participation.
              </div>
            </div>

            {/* Grid Item 4: Affordable Fees */}
            <div className="grid-item">
              <div
                className="grid-image"
                style={{ backgroundImage: `url(${img04})` }}
              ></div>
              <div className="grid-text">Affordable and competitive fees.</div>
            </div>
          </div>
        </div>
      </div>

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

      {/* Footer Section */}
      <Footer />
    </>
  );
}

