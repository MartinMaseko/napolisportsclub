import React from "react";
import "./club.css";
import Footer from "../footer/Footer";
import logo from "../assets/Napoli-2020.png";

/**
 * TheClub Component:
 *
 * This component displays information about the Napoli Sports Club, including its vision
 * and details about the club's owners. It also includes a link to contact the club via
 * WhatsApp and renders a Footer component.
 */

function TheClub() {
    return (
      <>
        {/* Club Header Section: Contains logo, vision statement, and contact link */}
        <div className="club-header">
          {/* Container for logo and vision details */}
          <div className="club-container">
            {/* Club Logo */}
            <img src={logo} alt="Napoli Logo" className="club-logo" />
  
            {/* Vision Heading */}
            <h1 className="club-heading">Our Vision</h1>
  
            {/* Vision Statement */}
            <p className="club-vision" aria-live="polite">
              To provide a first class football programme that will produce
              outstanding football players ready for local and international clubs.
              <br />
              To be an intermediary talent pool for professional clubs.
            </p>
  
            {/* WhatsApp Contact Link */}
            <a href="https://wa.me/+27737378310">
              <img
                id="whatsapp-icon"
                width="40"
                height="40"
                src="https://img.icons8.com/ios-filled/40/228BE6/whatsapp--v1.png"
                alt="WhatsApp icon"
              />
            </a>
          </div>
  
          {/* Owner Information Section: Displays details about club owners */}
          <div className="ownerinfo-container">
            {/* Owner 1: Mary Maseko */}
            <div className="owner-container">
              <img
                className="owner-icon"
                width="75"
                height="75"
                src="https://img.icons8.com/pastel-glyph/75/e9ecef/user-male-circle.png"
                alt="user-male-circle"
              />
              <h2 className="owner-name">Mary Maseko</h2>
              <p className="owner-detials">
                Mary Maseko is a co-owner of Napoli Sports Club. She is responsible
                for the day-to-day running of the club.
                <br />
                <br />
                Mary holds a B.Sc degree (Genetics and Botany) from the University
                of the Witwatersrand. She also holds a Post-graduate diploma in
                Human Resources Management from Wits Business School.
                <br />
                <br />
                Mary is passionate about nurturing talent and assisting talented
                young people to achieve their dreams. A passion she shares with her
                business partners.
              </p>
            </div>
  
            {/* Owner 2: Nancy Maseko */}
            <div className="owner-container">
              <img
                className="owner-icon"
                width="75"
                height="75"
                src="https://img.icons8.com/pastel-glyph/75/e9ecef/user-male-circle.png"
                alt="user-male-circle"
              />
              <h2 className="owner-name">Nancy Maseko</h2>
              <p className="owner-detials">
                Nancy Maseko is a co-owner of Napoli Sports Club. She is
                responsible for the sponsorship program of the club. Nancy holds a
                B.A. degree in International Relations from Wheaton College,
                Massachusetts, USA.
                <br />
                <br />
                She also holds a BA Honours degree in Political Science and
                Comparative Studies from the University of Cape Town. Nancy is
                passionate about nurturing talent and assisting talented young
                people to achieve their dreams.
                <br />
                <br />
                A passion she shares with her business partners.
              </p>
            </div>
  
            {/* Owner 3: Karabo Khumalo */}
            <div className="owner-container">
              <img
                className="owner-icon"
                width="75"
                height="75"
                src="https://img.icons8.com/pastel-glyph/75/e9ecef/user-male-circle.png"
                alt="user-male-circle"
              />
              <h2 className="owner-name">Karabo Khumalo</h2>
              <p className="owner-detials">
                Karabo Khumalo is a co-owner of Napoli Sports Club. Karabo is a well
                seasoned ex player of the game we love and currently also serves as
                the Sporting Director of the club.
                <br />
                <br />
                Furthermore, he possesses a Bachelor of Commerce in Law degree and
                his love for the game in developing the next generation of football
                icons is where he excels. Moulding footballers while young enables
                the organisation to carefully manage their development correctly
                and allow them a high ceiling in this unforgiving industry.
                <br />
                <br />
                Paving this 5-10 year plan for these youngsters is what Mr.Khumalo
                delivers to an excellent level.
              </p>
            </div>
          </div>
        </div>
  
        {/* Club Footer Section */}
        <div className="club-footer-container">
          <Footer />
        </div>
      </>
    );
  }

export default TheClub;