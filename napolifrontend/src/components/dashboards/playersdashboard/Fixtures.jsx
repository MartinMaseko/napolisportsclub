import React, { useEffect, useState } from "react";
import "./playersdashboard.css";


/**
 * Fixtures component displays a list of grouped calendar events by age group.
 * It retrieves events from the `calendarEvents` prop or falls back to localStorage.
 * Events are grouped by their `ageGroup` property and displayed in a structured format.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.calendarEvents - An object containing calendar events grouped by some key.
 * Each key maps to an array of event objects. Each event object may contain the following properties:
 *   - `text` {string}: The description or title of the event.
 *   - `time` {string}: The time of the event.
 *   - `address` {string}: The address of the event.
 *
 * @returns {JSX.Element} A rendered list of fixtures grouped by age group, or a fallback message if no fixtures are available.
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