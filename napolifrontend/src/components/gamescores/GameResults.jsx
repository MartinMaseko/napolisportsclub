import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import DashFooter from "../dashboards/dashfooter/DashFooter";
import "./gameresult.css";
import NapoliImg from "../assets/Napoli-2020.png";

/**
 * GameResults Component
 * Displays game results, allows score input, and calculates wins and losses.
 */
const GameResults = () => {
  const location = useLocation();

  // Memoize calendarEvents to avoid unnecessary re-renders
  const calendarEvents = useMemo(() => location.state?.calendarEvents || {}, [location.state]);

  // State to store game scores
  const [gameScores, setGameScores] = useState(() => {
    const savedScores = localStorage.getItem("gameScores");
    return savedScores ? JSON.parse(savedScores) : {};
  });

  // State to store the number of wins and losses
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  // Retrieve username from URL search parameters
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

  // Save gameScores to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("gameScores", JSON.stringify(gameScores));
  }, [gameScores]);

  // Calculate wins and losses based on displayed games in calendarEvents
  useEffect(() => {
    let winCount = 0;
    let lossCount = 0;

    // Iterate over displayed games in calendarEvents
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
    setGameScores((prevScores) => ({
      ...prevScores,
      [eventId]: {
        ...prevScores[eventId],
        [team]: value === "" ? "" : parseInt(value, 10), // Allow empty string for clearing input
      },
    }));
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
              events.map((event, index) => (
                <div key={`${date}-${index}`} className="game-card">
                  <p className="game-card-title">
                    <strong>Game:</strong> {event.text}
                  </p>
                  <p>
                    <strong>Age Group:</strong> {event.ageGroup}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(date).toLocaleDateString()}
                  </p>
                  <div className="score-inputs">
                    <label className="score-label">
                      Home Team Score:
                      <input
                        type="number"
                        value={gameScores[`${date}-${index}`]?.homeScore || ""}
                        onChange={(e) =>
                          handleScoreChange(`${date}-${index}`, "homeScore", e.target.value)
                        }
                      />
                    </label>
                    <label>
                      Away Team Score:
                      <input
                        type="number"
                        value={gameScores[`${date}-${index}`]?.awayScore || ""}
                        onChange={(e) =>
                          handleScoreChange(`${date}-${index}`, "awayScore", e.target.value)
                        }
                      />
                    </label>
                  </div>
                </div>
              ))
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