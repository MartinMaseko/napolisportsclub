import React, { useState, useEffect } from 'react';
import './dashfooter.css';
import { Link } from 'react-router-dom';

/**
 * DashFooter Component
 * Renders the footer for the dashboard with navigation links and user profile management.
 * @param {string} username - The username of the logged-in user.
 * @param {Object} calendarEvents - The calendar events to pass to other components.
 */
export default function DashFooter({ username, calendarEvents }) {
  // State to manage the visibility of the user profile dropdown
  const [showUserProfile, setShowUserProfile] = useState(false);

  // State to manage the user's profile image
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem('profileImage') || null
  );

  /**
   * Effect to sync the profile image with local storage.
   * Adds or removes the profile image from local storage based on its state.
   */
  useEffect(() => {
    if (profileImage) {
      localStorage.setItem('profileImage', profileImage);
    } else {
      localStorage.removeItem('profileImage');
    }
  }, [profileImage]);

  /**
   * Handles the profile image upload and updates the profile image state.
   * @param {Object} event - The file input change event.
   */
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <footer className="dashfooter">
        <div className="dashfooter-content">
          {/* Calendar Link */}
          <Link to={`/calendar?username=${encodeURIComponent(username)}`}>
            <img
              className="dash-icon"
              width="40"
              height="40"
              src="https://img.icons8.com/external-flat-kendis-lasman/55/external-notif-schedule-notification-alert-flat-flat-kendis-lasman.png" 
              alt="external-notif-schedule-notification-alert-flat-flat-kendis-lasman"
            />
          </Link>

          {/* Data Input Display Link */}
          <Link to={`/data-input-display?username=${encodeURIComponent(username)}`}>
            <img
              className="dash-icon"
              width="40"
              height="40"
              src="https://img.icons8.com/3d-fluency/100/opened-folder.png" 
              alt="opened-folder"
            />
          </Link>

          {/* Manager Dashboard Link */}
          <Link to={`/managersdashboard?username=${encodeURIComponent(username)}`}>
            <img
              className="dash-icon"
              width="45"
              height="45"
              src="https://img.icons8.com/glyph-neue/45/e9ecef/football2--v1.png"
              alt="Manager Dashboard"
            />
          </Link>

          {/* Game Results Link */}
          <Link
            to={`/gameresults?username=${encodeURIComponent(username)}`}
            state={{ calendarEvents }}
          >
            <img
              className="dash-icon"
              width="45"
              height="45"
              src="https://img.icons8.com/cotton/55/football-goal.png" 
              alt="football-goal"
            />
          </Link>

          {/* User Profile Section */}
          <div>
            <img
              className="dash-icon"
              width="50"
              height="50"
              src="https://img.icons8.com/3d-fluency/50/user-male-circle.png" 
              alt="user-male-circle"
              onClick={() => setShowUserProfile(!showUserProfile)}
              style={{ cursor: 'pointer' }}
            />
            {showUserProfile && (
              <div className="user-dropdown">
                <div className="profile-image-container">
                  {/* Profile Image Preview */}
                  {profileImage && (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="profile-preview"
                    />
                  )}
                  <h4>Username: {username}</h4>
                  <h4>Role: Manager</h4>

                  {/* Edit Profile Image */}
                  <div className="edit-profile">
                    <label htmlFor="profile-image-upload" className="upload-button">
                      Edit Profile Image
                    </label>
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                {/* Logout Link */}
                <Link to="/members"> 
                  <div className='logout-section'> Logout</div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}