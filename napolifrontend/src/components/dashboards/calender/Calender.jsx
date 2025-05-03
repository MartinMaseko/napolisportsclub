import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './calender.css';
import DashFooter from '../dashfooter/DashFooter.jsx';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, set, onValue, off } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

/**
 * Calendar Component
 *
 * This component renders an interactive calendar that allows users to view, add, edit, and delete events.
 * Users can navigate between months, select specific dates, and manage events for each date.
 *
 * Features:
 * - Displays a calendar grid for the current month.
 * - Allows navigation to previous and next months.
 * - Enables users to add events with details such as text, time, address, and age group.
 * - Supports editing and deleting existing events.
 * - Saves events to local storage for persistence.
 * - Displays events for the selected date in a list format.
 *
 * State Variables:
 * - `events`: Stores the events for each date.
 * - `currentDate`: Tracks the currently displayed month and year.
 * - `selectedDate`: Tracks the currently selected date.
 * - `newEventText`, `newEventTime`, `newEventAddress`, `newEventAgeGroup`: Manage input fields for adding new events.
 * - `isEditing`, `editingIndex`, `editText`, `editTime`, `editAddress`, `editAgeGroup`: Manage editing state and input fields for editing events.
 *
 * Props:
 * - None
 *
 * Dependencies:
 * - `useState`, `useEffect`: React hooks for managing state and side effects.
 * - `useSearchParams`: React Router hook for retrieving query parameters.
 *
 * Methods:
 * - `daysInMonth(year, month)`: Calculates the number of days in a given month.
 * - `firstDayOfMonth(year, month)`: Determines the first day of the month.
 * - `nextMonth()`: Navigates to the next month.
 * - `prevMonth()`: Navigates to the previous month.
 * - `handleAddEvent()`: Adds a new event to the selected date.
 * - `handleDeleteEvent(indexToDelete)`: Deletes an event from the selected date.
 * - `handleEditEvent(index)`: Initiates the editing process for an event.
 * - `handleSaveEdit()`: Saves the edited event.
 * - `handleCancelEdit()`: Cancels the editing process.
 * - `deselectDate()`: Deselects the currently selected date.
 *
 * Returns:
 * - JSX structure for rendering the calendar, event input section, and event list.
 */
const Calendar = () => {
  // State variables for managing calendar data and UI
  const [events, setEvents] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEventText, setNewEventText] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventAddress, setNewEventAddress] = useState('');
  const [newEventAgeGroup, setNewEventAgeGroup] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editAgeGroup, setEditAgeGroup] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(true);

  // Retrieve username from query parameters
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username') || 'defaultUser';

  // Firebase reference for shared events
  const sharedEventsRef = ref(database, `sharedEvents`);



  // Write events to /sharedEvents
  const writeEventsData = async (eventsData) => {
    try {
      await set(sharedEventsRef, eventsData);
      console.log("Shared events saved successfully!");
    } catch (error) {
      console.error("Error saving shared events:", error);
    }
  };

  // --- Firebase Data Fetching and Sync ---
  // Use useEffect to set up a listener when the component mounts
  // Fetch shared events from Firebase
  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = onValue(
      sharedEventsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setEvents(data);
        } else {
          setEvents({});
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching shared events:", error);
        setIsLoading(false);
      }
    );

    return () => {
      off(sharedEventsRef, "value", unsubscribe);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Calculates the number of days in a given month.
   * @param {number} year - The year.
   * @param {number} month - The month (0-indexed).
   * @returns {number} - Total days in the month.
   */

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  /**
   * Determines the first day of the month.
   * @param {number} year - The year.
   * @param {number} month - The month (0-indexed).
   * @returns {number} - The day of the week (0 = Sunday, 6 = Saturday).
   */
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);

  const days = [];


  // Generate empty slots for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  // Generate calendar days with events
  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day).toDateString();
    const hasEvent = events[date] && events[date].length > 0;
    days.push(
      <div
        key={day}
        className={`calendar-day ${hasEvent ? 'has-event' : ''} ${
          selectedDate === date ? 'selected' : ''
        }`}
        onClick={() => setSelectedDate(date)}
      >
        {day}
      </div>
    );
  }

  /**
   * Navigates to the next month.
   */
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  /**
   * Navigates to the previous month.
   */
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  /**
   * Handles adding a new event to the selected date.
   */
  const handleAddEvent = async () => {
    if (selectedDate && newEventText.trim() !== '' && newEventAgeGroup.trim() !== '') {
      // Create a temporary updated events object
      const updatedEvents = {
        ...events,
        [selectedDate]: [
          ...(events[selectedDate] || []),
          {
            text: newEventText.trim(),
            time: newEventTime,
            address: newEventAddress,
            ageGroup: newEventAgeGroup.trim(),
          },
        ],
      };

      // Write the entire updated events object to Firebase
      await writeEventsData(updatedEvents);

      // The onValue listener will automatically update the 'events' state
      // So we only need to clear the input fields here.
      setNewEventText('');
      setNewEventTime('');
      setNewEventAddress('');
      setNewEventAgeGroup('');

    } else {
      console.log('Please fill in all required fields (Match and Age Group) before adding an event.');
    }
  };

  /**
   * Handles deleting an event from the selected date.
   * @param {number} indexToDelete - Index of the event to delete.
   */
  const handleDeleteEvent = (indexToDelete) => {
    if (selectedDate && events[selectedDate]) {
      setEvents((prevEvents) => {
        const updatedEvents = { ...prevEvents };
        const remainingEvents = prevEvents[selectedDate].filter((_, index) => index !== indexToDelete);
        if (remainingEvents.length > 0) {
          updatedEvents[selectedDate] = remainingEvents;
        } else {
          delete updatedEvents[selectedDate];
        }
        return updatedEvents;
      });
    }
  };

  /**
   * Handles editing an event.
   * @param {number} index - Index of the event to edit.
   */
  const handleEditEvent = (index) => {
    setIsEditing(true);
    setEditingIndex(index);
    const eventToEdit = events[selectedDate][index];
    setEditText(eventToEdit.text);
    setEditTime(eventToEdit.time || '');
    setEditAddress(eventToEdit.address || '');
    setEditAgeGroup(eventToEdit.ageGroup || '');
  };

  /**
   * Saves the edited event.
   * Updates the state and then writes the new state to Firebase.
   */
  const handleSaveEdit = async () => { 
    if (selectedDate && events[selectedDate] && editingIndex !== null && editText.trim() !== '' && editAgeGroup.trim() !== '') {
      // Create a temporary updated events object based on the current state
      const updatedEvents = { ...events };
      const updatedDayEvents = [...events[selectedDate]]; // Work with a copy of the array

      // Update the specific event within the copied array
      updatedDayEvents[editingIndex] = {
        text: editText.trim(),
        time: editTime,
        address: editAddress,
        ageGroup: editAgeGroup.trim(),
      };

      // Place the updated array back into the temporary events object
      updatedEvents[selectedDate] = updatedDayEvents;

      // Write the entire updated events object to Firebase
      // The onValue listener will automatically update the component's 'events' state
      await writeEventsData(updatedEvents);

      // Reset editing state and clear input fields
      setIsEditing(false);
      setEditingIndex(null);
      setEditText('');
      setEditTime('');
      setEditAddress('');
      setEditAgeGroup('');
    } else {
      console.log('Please fill in all required fields (Match and Age Group) before saving.');
      // Optionally, provide feedback to the user in the UI
    }
  };

  /**
   * Cancels the editing process.
   */
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingIndex(null);
    setEditText('');
    setEditTime('');
    setEditAddress('');
    setEditAgeGroup('');
  };

  /**
   * Deselects the currently selected date.
   */
  const deselectDate = () => {
    setSelectedDate(null);
    setIsEditing(false);
    setEditingIndex(null);
    setEditText('');
    setEditTime('');
    setEditAddress('');
    setEditAgeGroup('');
  };

  return (
    <>
      <div className="calendar-container">
        {/* Calendar Header */}
        <div className="calendar-header">
          <img
            width="35"
            height="35"
            src="https://img.icons8.com/fluency/35/left.png"
            alt="Previous Month"
            onClick={prevMonth}
            style={{ cursor: 'pointer' }}
          />
          <h2>{currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</h2>
          <img
            width="35"
            height="35"
            src="https://img.icons8.com/fluency/35/right.png"
            alt="Next Month"
            onClick={nextMonth}
            style={{ cursor: 'pointer' }}
          />
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          <div className="calendar-weekday">S</div>
          <div className="calendar-weekday">M</div>
          <div className="calendar-weekday">T</div>
          <div className="calendar-weekday">W</div>
          <div className="calendar-weekday">T</div>
          <div className="calendar-weekday">F</div>
          <div className="calendar-weekday">S</div>
          {days}
        </div>

        {/* Event Input Section */}
        {selectedDate && (
          <div className="event-input">
            <h3>
              {isEditing
                ? `Edit Event: ${new Date(selectedDate).toLocaleDateString()}`
                : `Add or Edit: ${new Date(selectedDate).toLocaleDateString()}`}
              <button className="deselect-button" onClick={deselectDate}>
                Close
              </button>
            </h3>
            {isEditing ? (
              <>
                <input
                  type="text"
                  placeholder="Edit Match"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <input
                  type="time"
                  placeholder="Edit Match Time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                />
                <select value={editAgeGroup} onChange={(e) => setEditAgeGroup(e.target.value)}>
                  <option value="U12">U12</option>
                  <option value="U14">U14</option>
                  <option value="U17">U17</option>
                  <option value="SENIOR">SENIOR</option>
                </select>
                <input
                  type="text"
                  placeholder="Edit Address"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                />
                <div className="button-container">
                  <button onClick={handleSaveEdit}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Napoli Sports Club Vs Wits Fc"
                  value={newEventText}
                  onChange={(e) => setNewEventText(e.target.value)}
                />
                <label className="label-text" htmlFor="eventTime">
                  Time:
                </label>
                <input
                  type="time"
                  placeholder="Match Time"
                  onChange={(e) => setNewEventTime(e.target.value)}
                  value={newEventTime}
                />
                <select
                  value={newEventAgeGroup}
                  onChange={(e) => setNewEventAgeGroup(e.target.value)}
                >
                  <option value="">Select Age Group</option>
                  <option value="U12">U12</option>
                  <option value="U14">U14</option>
                  <option value="U17">U17</option>
                  <option value="SENIOR">SENIOR</option>
                </select>
                <input
                  type="text"
                  placeholder="Match Address"
                  value={newEventAddress}
                  onChange={(e) => setNewEventAddress(e.target.value)}
                />
                <button onClick={handleAddEvent}>Add</button>
              </>
            )}

            {/* Event List */}
            {events[selectedDate] && events[selectedDate].length > 0 && (
              <div className="events-list">
                <h4 className="eventlist-headertext">Fixtures:</h4>
                <ul>
                  {events[selectedDate].map((eventObject, index) => (
                    <li key={index}>
                      <p className="match-text">{eventObject.text}</p>
                      {eventObject.time && (
                        <p className="time-text">
                          Game Time: <strong>{eventObject.time}</strong>
                        </p>
                      )}
                      {eventObject.address && (
                        <p className="address-text">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              eventObject.address
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {eventObject.address}
                          </a>
                        </p>
                      )}
                      {eventObject.ageGroup && (
                        <p className="agegroup-text">
                          Age Group: <strong>{eventObject.ageGroup}</strong>
                        </p>
                      )}
                      <div className="event-actions">
                        <button
                          className="edit-button"
                          onClick={() => handleEditEvent(index)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteEvent(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Section */}
      <DashFooter username={username} calendarEvents={events} />
    </>
  );
};

export default Calendar;