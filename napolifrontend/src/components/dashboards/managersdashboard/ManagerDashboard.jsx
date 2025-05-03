import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off } from "firebase/database";
import "../dashboard.css";
import loadingGif from "../../homepage/assets/soccer-ball-gif.gif";
import NapoliImg from "../../assets/Napoli-2020.png";
import DashFooter from "../dashfooter/DashFooter";

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

export default function ManagerDashboard() {
  const [dateTime, setDateTime] = useState(""); // Current date and time
  const [loading, setLoading] = useState(true); // Loading state
  const [weatherData, setWeatherData] = useState(null); // Weather data
  const [showNotifications, setShowNotifications] = useState(false); // Notification dropdown visibility
  const [calendarEvents, setCalendarEvents] = useState({}); // Calendar events from Firebase
  const [hasCalendarEvents, setHasCalendarEvents] = useState(false); // Check if there are calendar events
  const [newRegistrations, setNewRegistrations] = useState([]);

  const welcomeHeaderRef = useRef(null); // Ref for the welcome header

  // Retrieve username from query parameters
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

  useEffect(() => {
    const newRegistrationsRef = ref(database, "newRegistrations");
  
    const unsubscribe = onValue(newRegistrationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const registrations = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setNewRegistrations(registrations);
      } else {
        setNewRegistrations([]);
      }
    });
  
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  /**
   * Fetch weather data for Northcliff, Johannesburg, South Africa.
   */
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Northcliff,Johannesburg,ZA&appid=310d3f519dd049d6582d6edaa9424ea3&units=metric`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  /**
   * Fetch calendar events from Firebase for the logged-in user.
   */
  useEffect(() => {
    if (!username) return;

    const userEventsRef = ref(database, `users/${username}/calendarEvents`);

    const unsubscribe = onValue(
      userEventsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCalendarEvents(data);
          setHasCalendarEvents(Object.keys(data).length > 0);
        } else {
          setCalendarEvents({});
          setHasCalendarEvents(false);
        }
      },
      (error) => {
        console.error("Error fetching calendar events:", error);
      }
    );

    return () => {
      off(userEventsRef, "value", unsubscribe);
    };
  }, [username]);

  /**
   * Fetch shared events from Firebase.
   */
  useEffect(() => {
    const sharedEventsRef = ref(database, `sharedEvents`);

    const unsubscribe = onValue(
      sharedEventsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCalendarEvents(data);
          setHasCalendarEvents(Object.keys(data).length > 0);
        } else {
          setCalendarEvents({});
          setHasCalendarEvents(false);
        }
      },
      (error) => {
        console.error("Error fetching shared events:", error);
      }
    );

    return () => {
      off(sharedEventsRef, "value", unsubscribe);
    };
  }, []);

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
            <h2 className="welcome-user">Welcome {username}!</h2>
          </div>

          {/* Notifications Section */}
          <div style={{ position: "relative" }}>
            <img
              className="notifications-icon"
              width="50"
              height="50"
              src="https://img.icons8.com/external-kiranshastry-solid-kiranshastry/50/FFFFFF/external-menu-multimedia-kiranshastry-solid-kiranshastry-1.png"
              alt="Notifications Icon"
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ cursor: "pointer" }}
            />
            {showNotifications && (
              <div className="notifications-dropdown">
                {hasCalendarEvents ? (
                  <ul>
                    <h3 id="fixture-Heading">FIXTURES</h3>
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
                {newRegistrations.length > 0 ? (
                  <ul>
                    <h3 id="fixture-Heading">NEW REGISTRATIONS</h3>
                    {newRegistrations.map((registration) => (
                      <li key={registration.id}>
                        <p className="notification-event">
                          <strong>Name:</strong> {registration.first_name} {registration.last_name} <br />
                          <strong>Age Group:</strong> {registration.age_group} <br />
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No new registrations</p>
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
                  width="55"
                  height="55"
                  src="https://img.icons8.com/cotton/55/football-goal.png"
                  alt="football-goal"
                />
                <p className="icon-text"> Game Results</p>
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
                  src="https://img.icons8.com/3d-fluency/100/opened-folder.png"
                  alt="opened-folder"
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
                src="https://img.icons8.com/external-flat-kendis-lasman/55/external-notif-schedule-notification-alert-flat-flat-kendis-lasman.png"
                alt="external-notif-schedule-notification-alert-flat-flat-kendis-lasman"
              />
              <p className="icon-text">Calendar</p>
            </Link>
          </div>

          {/* Weather Section */}
          <div className="dashboard-option-4">
            {weatherData ? (
              <div className="weather-content">
                <h2 className="weather-text">
                  <img
                    width="40"
                    height="40"
                    src="https://img.icons8.com/fluency/40/clouds--v3.png"
                    alt="clouds--v3"
                  />
                  Weather
                </h2>
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
      </main>
      {/* Footer Section */}
      <DashFooter username={username} calendarEvents={calendarEvents} />
    </>
  );
}