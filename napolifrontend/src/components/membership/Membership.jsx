import React from "react";
import "./membership.css";
import Footer from "../footer/Footer";
import img01 from "../assets/img10.png";
import img02 from "../assets/img4.jpg";
import img03 from "../assets/img12.png";
import img04 from "../assets/img13.png";

/**
 * Membership Component
 *
 * This component renders the Membership section of the application, showcasing
 * the benefits of joining the club. It includes a grid layout displaying various
 * membership perks, a WhatsApp contact link, and a footer section.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered Membership component.
 *
 * @example
 * <Membership />
 *
 * Features:
 * - Membership Benefits Section:
 *   - Training Programs: Excellent training programs using modern equipment 3 times a week.
 *   - Fitness Training: Dedicated fitness training sessions.
 *   - Games and Tournaments: Participation in league games, tournaments, and cup games.
 *   - Affordable Fees: Competitive and affordable membership fees.
 *
 * - WhatsApp Contact Link:
 *   - Provides a direct link to contact the club via WhatsApp.
 *
 * - Footer Section:
 *   - Displays the footer of the application.
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

