import React, { useState, useEffect } from "react";
import axios from "axios";

/**
 * Profile component fetches and displays detailed information about a player.
 * 
 * This component retrieves the player's details from an API using the player's ID
 * and authentication token stored in localStorage. It handles loading, error states,
 * and displays the player's profile information if successfully fetched.
 * 
 * @component
 * @returns {JSX.Element} The rendered Profile component.
 * 
 * @example
 * // Usage
 * <Profile />
 * 
 * @state {object|null} playerDetails - The details of the player fetched from the API.
 * @state {boolean} loading - Indicates whether the data is still being fetched.
 * @state {string|null} error - Stores any error message encountered during the fetch process.
 * 
 * @effect Fetches player details from the API when the component mounts.
 * 
 * @errorHandling
 * - Displays an error message if no authentication token or player ID is found.
 * - Displays an error message if the API request fails.
 * - Displays a message if the player is not found.
 * 
 * @loadingState
 * - Displays a loading message while the data is being fetched.
 * 
 * @display
 * - Renders the player's profile details including personal, contact, and financial information.
 */
export default function Profile() {
  const [playerDetails, setPlayerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      const token = localStorage.getItem("authToken");
      const idNumber = localStorage.getItem("username"); // Retrieve the username stored in localStorage

      if (!token || !idNumber) {
        setError("No authentication token or player ID found. Please log in again.");
        setLoading(false);
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
          setError("Player not found.");
        }
      } catch (err) {
        console.error("Error fetching player details:", err);
        setError("Failed to fetch player details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerDetails();
  }, []);

  if (loading) {
    return <p>Loading player details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!playerDetails) {
    return <p>No player details available.</p>;
  }

  return (
    <div className="player-details">
      <h3 className="cta-colour">Profile: {playerDetails.first_name} {playerDetails.last_name}</h3>
      <p><strong>Nationality:</strong> {playerDetails.nationality}</p>
      <p><strong>ID Number:</strong> {playerDetails.id_number}</p>
      <p><strong>Gender:</strong> {playerDetails.gender}</p>
      <p><strong>School:</strong> {playerDetails.school}</p>
      <p><strong>Previous Club:</strong> {playerDetails.previous_club}</p>
      <p><strong>Years of Training:</strong> {playerDetails.years_of_training}</p>
      <p><strong>Age Group:</strong> {playerDetails.age_group}</p>
      <p><strong>Notes:</strong> {playerDetails.notes}</p>
      <p><strong>Position:</strong> {playerDetails.position}</p>
      <p><strong>Goals:</strong> {playerDetails.goals}</p>
      <p><strong>Assists:</strong> {playerDetails.assists}</p>
      <p><strong>Mother's Name:</strong> {playerDetails.mother_name}</p>
      <p><strong>Mother's Phone:</strong> {playerDetails.mother_phone}</p>
      <p><strong>Mother's Email:</strong> {playerDetails.mother_email}</p>
      <p><strong>Father's Name:</strong> {playerDetails.father_name}</p>
      <p><strong>Father's Phone:</strong> {playerDetails.father_phone}</p>
      <p><strong>Father's Email:</strong> {playerDetails.father_email}</p>
      <p><strong>Amount Owed:</strong>R {playerDetails.amount_owed}</p>
      <p><strong>Amount Paid:</strong>R {playerDetails.amount_paid}</p>
      <p><strong>Balance:</strong>R {playerDetails.balance}</p>
    </div>
  );
}