import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, off } from "firebase/database";
import DashFooter from "../dashboards/dashfooter/DashFooter";
import "./gameresult.css";
import NapoliImg from "../assets/Napoli-2020.png";

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

const GameResults = () => {
  const [calendarEvents, setCalendarEvents] = useState({});
  const [gameScores, setGameScores] = useState({});
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  // Retrieve username from URL search parameters
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

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
        } else {
          setCalendarEvents({});
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
   * Fetch game scores from Firebase for the logged-in user.
   */
  useEffect(() => {
    if (!username) return;

    const userScoresRef = ref(database, `users/${username}/gameScores`);

    const unsubscribe = onValue(
      userScoresRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setGameScores(data);
        } else {
          setGameScores({});
        }
      },
      (error) => {
        console.error("Error fetching game scores:", error);
      }
    );

    return () => {
      off(userScoresRef, "value", unsubscribe);
    };
  }, [username]);

  /**
   * Save game scores to Firebase.
   */
  const saveGameScoresToFirebase = (updatedScores) => {
    if (!username) return;

    const userScoresRef = ref(database, `users/${username}/gameScores`);
    set(userScoresRef, updatedScores)
      .then(() => {
        console.log("Game scores saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving game scores:", error);
      });
  };

  /**
   * Calculate wins and losses based on game scores.
   */
  useEffect(() => {
    let winCount = 0;
    let lossCount = 0;

    Object.entries(calendarEvents).forEach(([date, events]) => {
      events.forEach((event, index) => {
        const eventId = `${date}-${index}`;
        const game = gameScores[eventId];

        if (game?.homeScore !== undefined && game?.awayScore !== undefined) {
          if (game.homeScore > game.awayScore) {
            winCount++;
          } else if (game.homeScore < game.awayScore) {
            lossCount++;
          }
        }
      });
    });

    setWins(winCount);
    setLosses(lossCount);
  }, [gameScores, calendarEvents]);

  /**
   * Handles score input changes for a specific game.
   * @param {string} eventId - Unique identifier for the game.
   * @param {string} team - The team being updated ("homeScore" or "awayScore").
   * @param {string} value - The new score value.
   */
  const handleScoreChange = (eventId, team, value) => {
    const updatedScores = {
      ...gameScores,
      [eventId]: {
        ...gameScores[eventId],
        [team]: value === "" ? "" : parseInt(value, 10),
      },
    };

    setGameScores(updatedScores);
    saveGameScoresToFirebase(updatedScores);
  };

  return (
    <>
      <div className="game-results-container">
        {/* Header Section */}
        <div className="results-heading">
          <img id="napoli-logo" src={NapoliImg} alt="Napoli logo" />
          <h2>Game Results</h2>
        </div>

        {/* Results Summary Section */}
        <div className="results-summary">
          <h3>Results Summary</h3>
          <p>
            <strong>Wins:</strong> {wins}
          </p>
          <p>
            <strong>Losses:</strong> {losses}
          </p>
        </div>

        {/* Scheduled Games Section */}
        <h3>Scheduled Games</h3>
        <div className="scheduled-games">
          {Object.entries(calendarEvents).length > 0 ? (
            Object.entries(calendarEvents).map(([date, events]) =>
              events.map((event, index) => {
                const eventId = `${date}-${index}`;
                return (
                  <div key={eventId} className="game-card">
                    <p className="game-card-title">
                      <strong>Game:</strong> {event.text}
                    </p>
                    <p>
                      <strong>Age Group:</strong> {event.ageGroup}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(date).toLocaleDateString()}
                    </p>
                    <div className="score-inputs">
                      <label className="score-label">
                        Home Team Score:
                        <input
                          type="number"
                          value={gameScores[eventId]?.homeScore || ""}
                          onChange={(e) =>
                            handleScoreChange(eventId, "homeScore", e.target.value)
                          }
                        />
                      </label>
                      <label>
                        Away Team Score:
                        <input
                          type="number"
                          value={gameScores[eventId]?.awayScore || ""}
                          onChange={(e) =>
                            handleScoreChange(eventId, "awayScore", e.target.value)
                          }
                        />
                      </label>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            <p>No scheduled games available.</p>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <DashFooter username={username} />
    </>
  );
};

export default GameResults;