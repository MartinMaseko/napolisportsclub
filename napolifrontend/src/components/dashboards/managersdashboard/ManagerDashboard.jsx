import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../dashboard.css";
import loadingGif from "../../homepage/assets/soccer-ball-gif.gif";
import NapoliImg from "../../assets/Napoli-2020.png";
import DashFooter from "../dashfooter/DashFooter";

const CALENDAR_EVENTS_KEY = "calendarEvents";

/**
 * ManagerDashboard Component
 * Displays the manager's dashboard with weather updates, notifications, and navigation links.
 */
export default function ManagerDashboard() {
  // State variables for managing UI and data
  const [dateTime, setDateTime] = useState(""); // Current date and time
  const [loading, setLoading] = useState(true); // Loading state
  const [weatherData, setWeatherData] = useState(null); // Weather data
  const [showNotifications, setShowNotifications] = useState(false); // Notification dropdown visibility
  const [calendarEvents, setCalendarEvents] = useState(() => {
    const storedEvents = localStorage.getItem(CALENDAR_EVENTS_KEY);
    return storedEvents ? JSON.parse(storedEvents) : {};
  }); // Calendar events from local storage
  const [hasCalendarEvents, setHasCalendarEvents] = useState(false); // Check if there are calendar events

  const welcomeHeaderRef = useRef(null); // Ref for the welcome header

  // Retrieve username from query parameters
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

  /**
   * Scroll to the top of the page and focus on the welcome header on mount.
   */
  useEffect(() => {
    window.scrollTo(0, 0);
    if (welcomeHeaderRef.current) {
      welcomeHeaderRef.current.focus();
    }
  }, []);

  /**
   * Simulate loading state for the dashboard.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  /**
   * Update the current date and time every minute.
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
   * Fetch weather data for the manager's location.
   */
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "310d3f519dd049d6582d6edaa9424ea3";
        const location = "Northcliff, ZA";
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          setWeatherData(data);
        } else {
          console.error("Failed to fetch weather data");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []);

  /**
   * Load calendar events from local storage and check if there are any events.
   */
  useEffect(() => {
    const storedEvents = localStorage.getItem(CALENDAR_EVENTS_KEY);
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      setCalendarEvents(parsedEvents);
      setHasCalendarEvents(Object.keys(parsedEvents).length > 0);
    } else {
      setHasCalendarEvents(false);
    }
  }, []);

  /**
   * Continuously check for updates to calendar events in local storage.
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedEvents = localStorage.getItem(CALENDAR_EVENTS_KEY);
      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents);
        setCalendarEvents(parsedEvents);
        setHasCalendarEvents(Object.keys(parsedEvents).length > 0);
      } else {
        setHasCalendarEvents(false);
      }
    }, 1000); // Check for updates every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

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
    <>
      <main className="dashboard-container">
        {/* Header Section */}
        <header className="dashboard-header"></header>
        <nav className="dashboard-nav">
          <img src={NapoliImg} alt="Napoli Logo" className="dash-logo" />
          <div className="user-text">
            <h2 className="welcome-user">Welcome, {username}!</h2>
          </div>

          {/* Notifications Section */}
          <div style={{ position: "relative" }}>
            <img
              className="notifications-icon"
              width="40"
              height="40"
              src="https://img.icons8.com/external-creatype-outline-colourcreatype/40/e9ecef/external-alarm-essential-ui-v2-creatype-outline-colourcreatype-2.png"
              alt="Notifications Icon"
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ cursor: "pointer" }}
            />
            {showNotifications && (
              <div className="notifications-dropdown">
                <h3>Notifications</h3>
                {hasCalendarEvents ? (
                  <ul>
                    <h3>FIXTURES</h3>
                    {Object.entries(calendarEvents).map(
                      ([date, eventsForDate]) =>
                        eventsForDate.map((event, index) => (
                          <li key={`${date}-${index}`}>
                            <p className="notification-event">
                              <strong>Date:</strong>{" "}
                              {new Date(date).toLocaleDateString()} <br />
                              <strong>Event:</strong> {event.text} <br />
                              <strong>Time:</strong> {event.time || "N/A"} <br />
                              <strong>Age Group:</strong>{" "}
                              {event.ageGroup || "N/A"}
                            </p>
                          </li>
                        ))
                    )}
                  </ul>
                ) : (
                  <p>No new notifications</p>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Current Date and Time */}
        <p className="current-datetime">{dateTime}</p>

        {/* Dashboard Tabs */}
        <div className="dashboard-tabs">
          {/* Game Results Tab */}
          <div className="dashboard-option-1">
            <Link
              to={`/gameresults?username=${encodeURIComponent(username)}`}
              state={{ calendarEvents }}
            >
              <div className="dash-header-content">
                <img
                  width="35"
                  height="35"
                  src="https://img.icons8.com/ios/35/e9ecef/notepad.png"
                  alt="Game Results Icon"
                />
                <p className="icon-text">Game Results</p>
              </div>
            </Link>
          </div>

          {/* Admin and Calendar Tabs */}
          <div className="dashtab-divider">
            <div className="dashboard-option-2">
              <Link
                to={`/data-input-display?username=${encodeURIComponent(
                  username
                )}`}
              >
                <img
                  width="55"
                  height="55"
                  src="https://img.icons8.com/ios/50/F2F2F2/opened-folder.png"
                  alt="Admin Icon"
                />
                <p className="icon-text">Admin</p>
              </Link>
            </div>
            <Link
              to={`/calendar?username=${encodeURIComponent(username)}`}
              className="dashboard-option-3"
            >
              <img
                width="55"
                height="55"
                src="https://img.icons8.com/ios/50/F2F2F2/calendar--v1.png"
                alt="Calendar Icon"
              />
              <p className="icon-text">Calendar</p>
            </Link>
          </div>

          {/* Weather Section */}
          <div className="dashboard-option-4">
            <h2 className="option-text">⛅ Weather</h2>
            {weatherData ? (
              <div className="weather-content">
                <p>
                  {weatherData.name}, {weatherData.sys.country}
                </p>
                <p>Temperature: {Math.round(weatherData.main.temp)}°C</p>
                <p>Weather: {weatherData.weather[0].description}</p>
                <img
                  src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                  alt="Weather Icon"
                />
              </div>
            ) : (
              <p>Loading weather...</p>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <DashFooter username={username} calendarEvents={calendarEvents} />
      </main>
    </>
  );
}