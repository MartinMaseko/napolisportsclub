import React, { useState, useEffect } from "react";
import "./playersdashboard.css";
import loadingGif from "../../homepage/assets/soccer-ball-gif.gif";
import napoliLogo from "../../assets/Napoli-2020.png";
import Profile from "./Profile";
import ClubFees from "./ClubFees";
import Fixtures from "./Fixtures";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off } from "firebase/database";

/**
 * PlayerDashboard Component
 * 
 * This component serves as the main dashboard for players, providing access to
 * various features such as viewing their profile, fixtures, and club fees. It also
 * manages the player's session and displays relevant information.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.username - The username of the logged-in player.
 * 
 * @returns {JSX.Element} The rendered PlayerDashboard component.
 * 
 * @example
 * <PlayerDashboard username="player123" />
 * 
 * State Variables:
 * - `dateTime` {string}: Current date and time displayed on the dashboard.
 * - `loading` {boolean}: Indicates whether the dashboard is in a loading state.
 * - `dropdownOpen` {boolean}: Controls the visibility of the dropdown menu.
 * - `calendarEvents` {Object}: Stores calendar events loaded from local storage.
 * - `activeComponent` {string}: Tracks the currently active dashboard tab.
 * - `playerDetails` {Object|null}: Stores the details of the logged-in player.
 * 
 * Effects:
 * - Fetches player details from the API on component mount.
 * - Simulates a loading state for 1.5 seconds on component mount.
 * - Updates the current date and time every minute.
 * - Loads calendar events from local storage on component mount.
 * 
 * Functions:
 * - `toggleDropdown`: Toggles the visibility of the dropdown menu.
 * - `handleMenuClick`: Handles menu option clicks and updates the active component.
 * - `renderActiveComponent`: Renders the active dashboard component based on the selected tab.
 * 
 * Conditional Rendering:
 * - Displays a loading screen while data is being fetched.
 * - Displays the active dashboard component based on the selected tab.
 */

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
        const response = await axios.get(`https://MartinMaseko.pythonanywhere.com/api/players/`, {
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
   * Fetch calendar events from Firebase.
   */
  useEffect(() => {
    const sharedEventsRef = ref(database, `sharedEvents`);

    const unsubscribe = onValue(
      sharedEventsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCalendarEvents(data);
        } else {
          setCalendarEvents({});
        }
      },
      (error) => {
        console.error("Error fetching calendar events:", error);
      }
    );

    return () => {
      off(sharedEventsRef, "value", unsubscribe);
    };
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