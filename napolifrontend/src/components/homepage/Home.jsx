import React, { useState, useEffect } from "react";
import "./homepage.css";
import bannerImage from "./assets/mobileBanner01.png";
import Footer from "../footer/Footer.jsx";
import JoinForm from "./JoinForm.jsx";
import loadingGif from "./assets/soccer-ball-gif.gif";

/**
 * Home Component
 * Displays the homepage with a banner, membership information, and a join form.
 */
export default function Home() {
  // State to toggle the visibility of the join form
  const [isJoinFormVisible, setIsJoinFormVisible] = useState(false);

  // State to manage the loading spinner
  const [loading, setLoading] = useState(true);

  // Simulate loading effect for 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  /**
   * Toggles the visibility of the join form.
   */
  const handleJoinButtonClick = () => {
    setIsJoinFormVisible(!isJoinFormVisible);
  };

  // Display a loading spinner while the page is loading
  if (loading) {
    return (
      <div className="loading-container" aria-live="polite">
        <img src={loadingGif} alt="Loading soccer club content" className="loading-gif" />
      </div>
    );
  }

  return (
    <>
      {/* Banner Section */}
      <div className="image-container">
        <img
          id="mobileBanner"
          src={bannerImage}
          alt="Close-up of soccer boots on a soccer field."
        />
      </div>

      {/* Main Content Section */}
      <main className="home-container">
        {/* About Section */}
        <section className="about-container">
          <header>
            <h2>BECOME A MEMBER TODAY!</h2>
          </header>
          <p>
            Don't just dream of playing – do it! Napoli Sports Club is your pathway
            to competitive soccer for boys 8 to 23.<br />
            <br />
            We provide top-tier training and a platform to showcase your talent. Register today and take the
            first step towards achieving your soccer goals with a team that's
            driven to win.
          </p>

          {/* Join Button */}
          <button
            id="join-btn"
            onClick={handleJoinButtonClick}
            aria-expanded={isJoinFormVisible}
            aria-controls="joinForm"
          >
            {isJoinFormVisible ? "Close" : "Join Napoli"}
          </button>

          {/* Join Form (conditionally rendered) */}
          {isJoinFormVisible && (
            <JoinForm onClose={handleJoinButtonClick} id="joinForm" role="dialog" aria-modal="true" />
          )}
        </section>

        {/* WhatsApp Contact Link */}
        <a
          href="https://wa.me/+27737378310"
          aria-label="Contact us on WhatsApp"
        >
          <img
            id="whatsapp-icon"
            width="40"
            height="40"
            src="https://img.icons8.com/ios-filled/40/228BE6/whatsapp--v1.png"
            alt="WhatsApp icon"
          />
        </a>

        {/* Footer Section */}
        <Footer />
      </main>
    </>
  );
}