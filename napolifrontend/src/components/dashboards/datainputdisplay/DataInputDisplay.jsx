import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from 'react-router-dom';
import axios from "axios";
import DashFooter from "../dashfooter/DashFooter";
import './datastyle.css'
import NapoliImg from  "../../assets/Napoli-2020.png";

const CALENDAR_EVENTS_KEY = 'calendarEvents';

/**
 * DataInputDisplay Component
 * Manages player data, including adding, editing, deleting, and displaying player details.
 * Allows uploading documents and filtering/searching players.
 */

export default function DataInputDisplay() {
    // State for managing form data
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        nationality: "",
        id_number: "",
        gender: "",
        school: "",
        previous_club: "",
        years_of_training: 0,
        age_group: "U12", 
        notes: "",
        position: "",
        goals: 0,
        assists: 0,
        mother_name: "",
        mother_phone: "",
        mother_email: "",
        father_name: "",
        father_phone: "",
        father_email: "",
        amount_owed: 0.0,
        amount_paid: 0.0,
    });

    // State variables for managing players, documents, and UI
    const [players, setPlayers] = useState([]); 
    const [filteredPlayers, setFilteredPlayers] = useState([]); 
    const [selectedPlayer, setSelectedPlayer] = useState(null); 
    const [showForm, setShowForm] = useState(false); 
    const [loading, setLoading] = useState(true); 
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null); 
    const [searchQuery, setSearchQuery] = useState("");
    const playerDetailsRef = useRef(null);

    // Retrieve calendar events from local storage
    const [calendarEvents] = useState(() => {
        const savedEvents = localStorage.getItem(CALENDAR_EVENTS_KEY);
        return savedEvents ? JSON.parse(savedEvents) : {};
    });

    // Retrieve username from query parameters
    const [searchParams] = useSearchParams();
    const username = searchParams.get('username');

    const formRef = useRef(null); // Ref for the form
    
    /**
   * Handles player selection and scrolls to the player's details.
   * @param {Object} player - The selected player object.
   */
    const handlePlayerClick = (player) => {
        setSelectedPlayer(player); // Set the selected player
        setTimeout(() => {
            playerDetailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100); // Small delay to ensure the details are rendered
    };

    /**
   * Toggles the visibility of the player form.
   */   
    const handleToggleForm = () => {
        setShowForm(!showForm);
        if (!showForm) {
            // Scroll to the form when it opens
            setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100); // Small delay to ensure the form is rendered
        }
    };

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    console.error("No token found. User must be logged in.");
                    return; // Or redirect to login
                }
                const response = await axios.get("https://MartinMaseko.pythonanywhere.com/api/players/", {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setPlayers(response.data);
                setFilteredPlayers(response.data); // Initialize filtered players
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Filter players by age
    const filterByAge = () => {
        const sortedByAge = [...players].sort((a, b) => a.age_group - b.age_group);
        setFilteredPlayers(sortedByAge);
    };

    // Filter players alphabetically
    const filterAlphabetically = () => {
        const sortedAlphabetically = [...players].sort((a, b) =>
            a.first_name.localeCompare(b.first_name)
        );
        setFilteredPlayers(sortedAlphabetically);
    };

    /**
   * Handles search input changes and filters players by name or ID number.
   * @param {Object} e - The input change event.
   */
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Search by both name and ID number
        if (query) {
            const searchedPlayers = players.filter((player) =>
                player.id_number.toLowerCase().includes(query.toLowerCase()) ||
                player.first_name.toLowerCase().includes(query.toLowerCase()) ||
                player.last_name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredPlayers(searchedPlayers);
        } else {
            setFilteredPlayers(players); // Reset to all players if query is empty
        }
    };

    // Fetch documents for the selected player
    useEffect(() => {
        if (selectedPlayer) {
            const fetchDocuments = async () => {
                try {
                    const token = localStorage.getItem('authToken');
                    if (!token) {
                        console.error("No token found. User must be logged in.");
                        return; // Or redirect to login
                    }
                    const response = await axios.get(`https://MartinMaseko.pythonanywhere.com/api/documents/?player=${selectedPlayer.id}`, {
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    });
                    setDocuments(response.data);
                } catch (error) {
                    console.error("Error fetching documents:", error);
                }
            };
            fetchDocuments();
        }
    }, [selectedPlayer]);

    /**
   * Handles form submission for adding a new player.
   * @param {Object} e - The form submission event.
   */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error("No token found. User must be logged in.");
                return; // Or redirect to login
            }
            const response = await axios.post("https://MartinMaseko.pythonanywhere.com/api/data/", formData, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setPlayers([...players, response.data]); // Add the new player to the list
            setFormData({
                first_name: "",
                last_name: "",
                nationality: "",
                id_number: "",
                gender: "",
                school: "",
                previous_club: "",
                years_of_training: 0,
                age_group: "U12", // Default value
                notes: "",
                position: "",
                goals: 0,
                assists: 0,
                mother_name: "",
                mother_phone: "",
                mother_email: "",
                father_name: "",
                father_phone: "",
                father_email: "",
                amount_owed: 0.0,
                amount_paid: 0.0,
            }); // Reset the form
            setShowForm(false); // Hide the form after submission
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    /**
   * Handles document upload for the selected player.
   * @param {Object} e - The form submission event.
   */
    const handleDocumentUpload = async (e) => {
        e.preventDefault();
        if (!file || !selectedPlayer) {
            alert("Please select a file and a player.");
            return;
        }
        const formData = new FormData();
        formData.append("player", selectedPlayer.id);
        formData.append("file", file);
        formData.append("document_type", "other"); 
        try {
            const token = localStorage.getItem('authToken'); // Retrieve token from local storage
            console.log("Token:", token); 
            if (!token) {
                console.error("No authentication token found. User must log in.");
                alert("Please log in to upload documents.");
                return;
            }
            const response = await axios.post("https://MartinMaseko.pythonanywhere.com/api/documents/upload/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Token ${token}`, 
                },
            });
            setDocuments([...documents, response.data]); 
            setFile(null); 
        } catch (error) {
            console.error("Error uploading document:", error);
        }
    };

    /**
   * Handles form submission for editing an existing player.
   * @param {Object} e - The form submission event.
   */
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error("No token found. User must be logged in.");
                return; // Or redirect to login
            }
            const response = await axios.put(`https://MartinMaseko.pythonanywhere.com/api/players/${formData.id}/`, formData, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setPlayers(players.map(player =>
                player.id === response.data.id ? response.data : player
            ));
            setFormData({
                first_name: "",
                last_name: "",
                nationality: "",
                id_number: "",
                gender: "",
                school: "",
                previous_club: "",
                years_of_training: 0,
                age_group: "U12", // Default value
                notes: "",
                position: "",
                goals: 0,
                assists: 0,
                mother_name: "",
                mother_phone: "",
                mother_email: "",
                father_name: "",
                father_phone: "",
                father_email: "",
                amount_owed: 0.0,
                amount_paid: 0.0,
            });
            setShowForm(false);
            setSelectedPlayer(response.data);
        } catch (error) {
            console.error("Error updating player:", error);
            alert("Error updating player data. Please try again.");
        }
    };

    /**
   * Handles registering a player as a user.
   * @param {number} playerId - The ID of the player to register.
   */
    const handleRegisterUser = async (playerId) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error("No token found. User must be logged in.");
                return; // Or redirect to login
            }

            const response = await axios.post(`https://MartinMaseko.pythonanywhere.com/api/players/${playerId}/register/`, {}, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            alert(response.data.message); // Show success message
        } catch (error) {
            console.error("Error registering user:", error.response?.data || error.message);
            alert(error.response?.data?.error || "Failed to register user.");
        }
    };

    return (
        <>
        <div className="data-input-display">
             {/* Header Section */}
            <div className="heading-text">
                <img id="napoli-logo" src={NapoliImg} alt="napoli logo"/>
                <h2 className="data-header">Players: {filteredPlayers.length}</h2>
            </div>
            {/* Filter and Search Controls */}
            <div className="filter-btns-container">
                <input
                    id="search-input"
                    type="text"
                    placeholder="Search by Name or ID Number"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ marginLeft: "10px", padding: "5px" }}
                />
                <button id="age-filterbtn" onClick={filterByAge}>Filter by Age</button>
                <button id="alphabet-filterbtn" onClick={filterAlphabetically}>Filter Alphabetically</button>
                <button id="addplayer-btn" onClick={handleToggleForm}>
                    {showForm ? (
                        <>
                            <img width="35" height="35" src="https://img.icons8.com/ios/35/004582/cancel.png" alt="cancel" />

                        </>
                    ) : (
                        <>
                            <img width="30" height="30" src="https://img.icons8.com/external-kmg-design-flat-kmg-design/30/external-add-user-interface-essentials-kmg-design-flat-kmg-design.png" alt="external-add-user-interface-essentials-kmg-design-flat-kmg-design"/>
                            Add Player
                        </>
                    )}
                </button>
            </div>


            {/* Form for adding a new player */}
            {showForm && (
                <form ref={formRef} onSubmit={formData.id ? handleEditSubmit : handleSubmit} className="bordered-form">
                    <div className="form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                        required
                    />
                    </div>
                    <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                        required
                    />
                    </div>
                    <div className="form-group">
                    <label>Nationality:</label>
                    <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    />
                    </div>
                    <div className="form-group">
                    <label>ID Number:</label>
                    <input
                        type="text"
                        name="id_number"
                        value={formData.id_number}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                        required
                    />
                    </div>
                    <div className="form-group">
                    <label>Gender:</label>
                    <input
                        type="text"
                        name="gender"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    />
                    </div>
                    <div className="form-group">
                    <label>School:</label>
                    <input
                        type="text"
                        name="school"
                        value={formData.school}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    />
                    </div>
                    <div className="form-group">
                    <label>Previous Club:</label>
                    <input
                        type="text"
                        name="previous_club"
                        value={formData.previous_club}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    />
                    </div>
                    <div className="form-group">
                    <label>Years of Training:</label>
                    <input
                        type="number"
                        name="years_of_training"
                        value={formData.years_of_training}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) })}
                    />
                    </div>
                    <div className="form-group">
                    <label>Age Group:</label>
                    <select
                        name="age_group"
                        value={formData.age_group}
                        onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
                        required
                    >
                        <option value="">Select Age Group</option>
                        <option value="U12">U12</option>
                        <option value="U14">U14</option>
                        <option value="U17">U17</option>
                        <option value="SENIOR">SENIOR</option>
                    </select>
                    </div>
                    <div className="form-group">
                    <label>Notes:</label>
                    <textarea
                        id="formtext-area"
                        name="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    />
                    </div>
                    <div className="form-group">
                    <label>Position:</label>
                    <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    />
                    </div>
                    <div className="form-group">
                    <label>Goals:</label>
                    <input
                        type="number"
                        name="goals"
                        value={formData.goals}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) })}
                    />
                    </div>
                    <div className="form-group">
                    <label>Assists:</label>
                    <input
                        type="number"
                        name="assists"
                        value={formData.assists}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) })}
                    />
                    </div>
                    <div className="form-group">
                    <label>Mother's Name:</label>
                    <input
                        type="text"
                        name="mother_name"
                        value={formData.mother_name}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    />
                    </div>
                    <div className="form-group">
                    <label>Mother's Phone:</label>
                    <input
                        type="text"
                        name="mother_phone"
                        value={formData.mother_phone}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    />
                    </div>
                    <div className="form-group">
                    <label>Mother's Email:</label>
                    <input
                        type="email"
                        name="mother_email"
                        value={formData.mother_email}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    />
                    </div>
                    <div className="form-group">
                    <label>Father's Name:</label>
                    <input
                        type="text"
                        name="father_name"
                        value={formData.father_name}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    />
                    </div>
                    <div className="form-group">
                    <label>Father's Phone:</label>
                    <input
                        type="text"
                        name="father_phone"
                        value={formData.father_phone}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    />
                    </div>
                    <div className="form-group">
                    <label>Father's Email:</label>
                    <input
                        type="email"
                        name="father_email"
                        value={formData.father_email}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    />
                    </div>
                    <div className="form-group">
                    <label>Amount Owed:</label>
                    <input
                        type="number"
                        name="amount_owed"
                        value={formData.amount_owed}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) })}
                    />
                    </div>
                    <div className="form-group">
                    <label>Amount Paid:</label>
                    <input
                        type="number"
                        name="amount_paid"
                        value={formData.amount_paid}
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) })}
                    />
                    </div>
                    <button type="submit">Submit</button>
                </form>
                )}

            {/* Display fetched data */}
            <h3 id="data-headings">Club Players</h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <dl>
                    {Object.entries(
                        filteredPlayers.reduce((groups, player) => {
                            const { age_group } = player;
                            if (!groups[age_group]) {
                                groups[age_group] = [];
                            }
                            groups[age_group].push(player);
                            return groups;
                        }, {})
                    ).map(([ageGroup, players]) => (
                        <div key={ageGroup}>
                            {/* Age Group Heading */}
                            <h3>{ageGroup}</h3>
                            {players.map((player, index) => (
                                <dt key={index} onClick={() => {
                                    handlePlayerClick(player);
                                    setSelectedPlayer(player);
                                }}>
                                    <strong>{player.first_name} {player.last_name}</strong>
                                </dt>
                            ))}
                        </div>
                    ))}
                </dl>
            )}

            {/* Display selected player details */}
            {selectedPlayer && (
                <div ref={playerDetailsRef} className="player-details">
                    <h3 id="playerDetails-Heading">Details for {selectedPlayer.first_name} {selectedPlayer.last_name}</h3>
                    <p><strong>Nationality:</strong> {selectedPlayer.nationality}</p>
                    <p><strong>ID Number:</strong> {selectedPlayer.id_number}</p>
                    <p><strong>Gender:</strong> {selectedPlayer.gender}</p>
                    <p><strong>School:</strong> {selectedPlayer.school}</p>
                    <p><strong>Previous Club:</strong> {selectedPlayer.previous_club}</p>
                    <p><strong>Years of Training:</strong> {selectedPlayer.years_of_training}</p>
                    <p><strong>Age Group:</strong> {selectedPlayer.age_group}</p>
                    <p><strong>Notes:</strong> {selectedPlayer.notes}</p>
                    <p><strong>Position:</strong> {selectedPlayer.position}</p>
                    <p><strong>Goals:</strong> {selectedPlayer.goals}</p>
                    <p><strong>Assists:</strong> {selectedPlayer.assists}</p>
                    <p><strong>Mother's Name:</strong> {selectedPlayer.mother_name}</p>
                    <p><strong>Mother's Phone:</strong> {selectedPlayer.mother_phone}</p>
                    <p><strong>Mother's Email:</strong> {selectedPlayer.mother_email}</p>
                    <p><strong>Father's Name:</strong> {selectedPlayer.father_name}</p>
                    <p><strong>Father's Phone:</strong> {selectedPlayer.father_phone}</p>
                    <p><strong>Father's Email:</strong> {selectedPlayer.father_email}</p>
                    <p><strong>Amount Owed:</strong> {selectedPlayer.amount_owed}</p>
                    <p><strong>Amount Paid:</strong> {selectedPlayer.amount_paid}</p>
                    <p><strong>Balance:</strong> {selectedPlayer.balance}</p>

                    {/* Document Upload Form */}
                    <form onSubmit={handleDocumentUpload}>
                        <div>
                            <label>Upload Document:</label>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>
                        <button className="Dark-Btns" type="submit">Upload</button>
                    </form>

                    {/* Display Documents */}
                    <h4>Documents</h4>
                    <ul>
                        {documents.map((doc, index) => {
                            const fileUrl = doc.file.startsWith("http")
                                ? doc.file
                                : `https://MartinMaseko.pythonanywhere.com/${doc.file}`; // Prepend backend URL if needed

                            return (
                                <li key={index} style={{ marginBottom: "10px" }}>
                                    {fileUrl.endsWith(".png") || fileUrl.endsWith(".jpg") || fileUrl.endsWith(".jpeg") || fileUrl.endsWith(".gif") ? (
                                        // Render image files with clickable links
                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={fileUrl}
                                                alt={doc.document_type}
                                                style={{ width: "100px", height: "auto", marginRight: "10px", cursor: "pointer" }}
                                            />
                                        </a>
                                    ) : fileUrl.endsWith(".pdf") ? (
                                        // Render PDF files as clickable links
                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                            {doc.document_type} - View PDF
                                        </a>
                                    ) : (
                                        // Render other file types as clickable links
                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                            {doc.document_type} - {doc.description || "Download"}
                                        </a>
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                    {/* Buttons Container */}
                    <div className="Btns-Container">
                        {/* Edit Button */}
                        <button className="Dark-Btns" onClick={() => {
                            setFormData(selectedPlayer); // Populate the form with the selected player's data
                            setShowForm(true); // Show the form for editing
                            setSelectedPlayer(null); // Close the details view
                        }}>
                            Edit
                        </button>

                        {/* Delete Button */}
                        <button
                            className="Dark-Btns"
                            onClick={async () => {
                                try {
                                    const token = localStorage.getItem('authToken'); // Retrieve the token
                                    if (!token) {
                                        console.error("No authentication token found. User must log in.");
                                        alert("Please log in to delete players.");
                                        return;
                                    }

                                    await axios.delete(`https://MartinMaseko.pythonanywhere.com//api/players/${selectedPlayer.id}/`, {
                                        headers: {
                                            'Authorization': `Token ${token}`, // Include the token in the headers
                                        },
                                    });

                                    setPlayers(players.filter(player => player.id !== selectedPlayer.id)); // Remove the player from the list
                                    setSelectedPlayer(null); // Close the details view
                                } catch (error) {
                                    console.error("Error deleting player:", error.response?.data || error.message);
                                    alert("Error deleting player. Please try again.");
                                }
                            }}
                        >
                            Delete
                        </button>

                        {/* Register Button */}
                        <button 
                            className="Dark-Btns"
                            onClick={() => handleRegisterUser(selectedPlayer.id)}>Register</button>

                        {/* Close Button */}
                        <button 
                            className="Dark-Btns"
                            onClick={() => setSelectedPlayer(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
        <DashFooter username={username} calendarEvents={calendarEvents} />
        </>
    );
}