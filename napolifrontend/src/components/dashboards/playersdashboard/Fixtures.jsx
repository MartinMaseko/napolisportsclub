import React, { useEffect, useState } from "react";
import "./playersdashboard.css";

/**
 * Fixtures Component
 * Displays a list of fixtures grouped by age group.
 * 
 * Props:
 * - calendarEvents (object): Optional. A collection of events grouped by age group.
 */
export default function Fixtures({ calendarEvents }) {
  const [groupedEvents, setGroupedEvents] = useState({}); // State to store grouped events

  useEffect(() => {
    // Retrieve events from props or fallback to localStorage
    const events = calendarEvents || JSON.parse(localStorage.getItem("calendarEvents")) || {};
    console.log("Retrieved Events:", events); // Debugging

    // Flatten the events object into an array
    const allEvents = Object.values(events).flat();
    console.log("Flattened Events:", allEvents); // Debugging

    // Group events by age group
    const grouped = allEvents.reduce((acc, event) => {
      if (!acc[event.ageGroup]) {
        acc[event.ageGroup] = [];
      }
      acc[event.ageGroup].push(event);
      return acc;
    }, {});

    console.log("Grouped Events:", grouped); // Debugging
    setGroupedEvents(grouped); // Update state with grouped events
  }, [calendarEvents]);

  return (
    <div>
      <h2>Fixtures</h2>
      {Object.keys(groupedEvents).length > 0 ? (
        // Render grouped events
        Object.entries(groupedEvents).map(([ageGroup, events]) => (
          <div key={ageGroup}>
            <h3>{ageGroup}</h3>
            <ul className="gamedisplay-contianer">
              {events.map((event, index) => (
                <li className="game-display" key={index}>
                  <p>{event.text}</p>
                  {event.time && <p>Time: {event.time}</p>}
                  {event.address && (
                    <p>
                      Address:{" "}
                      <a
                        className="address-link"
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {event.address}
                      </a>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        // Fallback message if no fixtures are available
        <p>No fixtures available.</p>
      )}
    </div>
  );
}