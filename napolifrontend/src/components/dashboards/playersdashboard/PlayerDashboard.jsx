import React, { useState, useEffect } from "react";
import "./playersdashboard.css";
import loadingGif from "../../homepage/assets/soccer-ball-gif.gif";
import napoliLogo from "../../assets/Napoli-2020.png";
import Profile from "./Profile";
import ClubFees from "./ClubFees";
import Fixtures from "./Fixtures";
import axios from "axios";

/**
 * PlayerDashboard Component
 * Displays the player's dashboard with navigation to Profile, Fixtures, and Club Fees.
 * Handles fetching player details and calendar events.
 * @param {string} username - The username of the logged-in player.
 */
export default function PlayerDashboard({ username }) {
  // State variables for managing UI and data
  const [dateTime, setDateTime] = useState(""); // Current date and time
  const [loading, setLoading] = useState(true); // Loading state
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown menu visibility
  const [calendarEvents, setCalendarEvents] = useState({}); // Calendar events
  const [activeComponent, setActiveComponent] = useState("Fixtures"); // Active dashboard tab
  const [playerDetails, setPlayerDetails] = useState(null); // Player details

  // Retrieve player name from local storage
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");

  /**
   * Fetches player details from the API.
   */
  useEffect(() => {
    const fetchPlayerDetails = async () => {
      const token = localStorage.getItem("authToken");
      const idNumber = localStorage.getItem("username");

      if (!token || !idNumber) {
        console.error("No authentication token or player ID found.");
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/players/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
          params: {
            id_number: idNumber,
          },
        });

        if (response.data.length > 0) {
          setPlayerDetails(response.data[0]);
        } else {
          console.error("Player not found.");
        }
      } catch (err) {
        console.error("Error fetching player details:", err);
      }
    };

    fetchPlayerDetails();
  }, []);

  /**
   * Simulates a loading state for the dashboard.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  /**
   * Updates the current date and time every minute.
   */
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = { weekday: "short", day: "numeric", month: "long" };
      const formattedDateTime = now.toLocaleDateString("en-US", options);
      setDateTime(formattedDateTime);
    };

    updateDateTime(); // Initial update
    const intervalId = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  /**
   * Loads calendar events from local storage.
   */
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("calendarEvents")) || {};
    setCalendarEvents(savedEvents);
  }, []);

  /**
   * Toggles the visibility of the dropdown menu.
   */
  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  /**
   * Handles menu option clicks.
   * @param {string} option - The selected menu option.
   */
  const handleMenuClick = (option) => {
    setDropdownOpen(false);

    if (option === "Logout") {
      // Clear session data
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");

      // Redirect to Members page
      window.location.href = "/members";
      return;
    }
    setActiveComponent(option);
  };

  /**
   * Renders the active dashboard component based on the selected tab.
   * @returns {JSX.Element} - The active component.
   */
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Profile":
        return <Profile playerDetails={playerDetails} />;
      case "Fixtures":
        return <Fixtures calendarEvents={calendarEvents} />;
      case "Club Fees":
        return <ClubFees playerDetails={playerDetails} />;
      default:
        return <Profile playerDetails={playerDetails} />;
    }
  };

  // Show loading screen while data is being fetched
  if (loading) {
    return (
      <div className="loading-container" aria-live="polite">
        <img
          src={loadingGif}
          alt="Loading soccer club content"
          className="loading-gif"
        />
      </div>
    );
  }

  return (
    <div className="playerdashboard-container">
      <div className="playerlout-container">
        {/* Header Section */}
        <div className="playerheader-display">
          <img className="napoli-logo" src={napoliLogo} alt="Napoli Logo" />
          <h2 className="welcome-players">NSC</h2>
          <div id="dropdown-container">
            <img
              className="player-menuicon"
              width="40"
              height="40"
              src="https://img.icons8.com/material-outlined/100/000000/menu--v1.png"
              alt="Menu Icon"
              style={{ cursor: "pointer" }}
              onClick={toggleDropdown}
            />
            <ul id="dropdown-menu" className={dropdownOpen ? "show" : ""}>
              <li onClick={() => handleMenuClick("Profile")}>Profile</li>
              <li onClick={() => handleMenuClick("Fixtures")}>Fixtures</li>
              <li onClick={() => handleMenuClick("Club Fees")}>Club Fees</li>
              <li onClick={() => handleMenuClick("Logout")}>Logout</li>
            </ul>
          </div>
        </div>

        {/* Player Info Section */}
        <p>
          <strong>Player:</strong> {firstName} {lastName}
        </p>
        <p>
          <strong>{dateTime}</strong>
        </p>

        {/* Active Component Section */}
        <div className="active-component-container">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
}