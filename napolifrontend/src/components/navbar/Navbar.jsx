import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import napoliLogo from './assets/Napoli-2020.png';
import './navbarstyle.css'; 

/**
 * @component
 * @description Renders a login form for authenticated members to access their dashboards.
 * Handles user input for username and password, submits login credentials to the backend,
 * manages authentication state, and redirects users based on their roles upon successful login.
 * Provides error handling for invalid credentials or login failures.
 * Includes a link for users to contact support via WhatsApp.
 *
 * @state {object} formData - Stores the username and password entered by the user.
 * @state {string} error - Holds any error message to be displayed to the user (e.g., validation errors, login failures).
 *
 * @function handleChange - Updates the `formData` state with the current value of the input field
 * and clears any existing error messages when input changes.
 * @param {object} event - The change event object from the input field.
 * @returns {void}
 *
 * @function handleSubmit - Handles the form submission. It prevents the default form submission,
 * validates the input fields, sends a POST request to the backend for authentication,
 * and upon successful authentication, stores user information in `localStorage` and redirects
 * the user to their dashboard based on their assigned role. Displays an error message if
 * authentication fails.
 * @param {object} event - The submit event object from the form.
 * @returns {void}
 *
 * @dependency {module} axios - Used for making asynchronous HTTP requests to the backend API.
 * @dependency {module} useNavigate - A hook from React Router for programmatically navigating between routes.
 *
 * @returns {JSX.Element} - A container displaying the login form with input fields for username and password,
 * an error message area, a submit button, and a link to contact support via WhatsApp.
 */

function Navbar() {
    // State to manage the menu's open/closed state.
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    /**
     * toggleMenu:
     *
     * Function to toggle the mobile menu's visibility.  It switches the 'isMenuOpen'
     * state between true and false.
     */
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    /**
     * useEffect Hook (Menu Open/Close):
     *
     * This useEffect hook handles side effects related to the mobile menu's state.
     * When the menu is open, it adds a class to the body to prevent scrolling.
     * When the menu is closed, it removes this class.  It also includes a cleanup
     * function to ensure that the 'no-scroll' class is removed when the component
     * unmounts or when 'isMenuOpen' changes.
     *
     * Dependency: [isMenuOpen] -  The effect runs whenever 'isMenuOpen' changes.
     */
    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('no-scroll'); // Prevent scrolling when menu is open
        } else {
            document.body.classList.remove('no-scroll'); // Re-enable scrolling when menu is closed
        }

        // Cleanup function:  Remove 'no-scroll' class when the component unmounts
        // or when isMenuOpen changes.  This prevents unintended side-effects.
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isMenuOpen]);

    return (
        <nav>
            {/* Main navigation container */}
            <div className="navbar">

                {/* Logo section with a link to the home page */}
                <div className="logo-section">
                    <NavLink to="/">
                        <img id="logo" src={napoliLogo} alt="napoli logo" />
                    </NavLink>
                </div>
                
                {/* Text logo */}
                <h1 id="text-logo">NSC</h1>

                {/* Navigation icon (for mobile) and dropdown menu */}
                <div 
                    className={`nav-icon ${isMenuOpen ? 'active' : ''}`} 
                    onClick={toggleMenu}
                    aria-expanded={isMenuOpen}
                    aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    >
                    {isMenuOpen ? 
                    <img width="35" height="35" src="https://img.icons8.com/ios-glyphs/35/delete-sign.png" alt="delete-sign"/>
                    : <img width="35" height="35" src="https://img.icons8.com/material-outlined/35/004582/menu--v1.png" alt="menu--v1"/> }
                    {/* Dropdown menu list */}
                    <ul className="dropdown-menu">
                        <li>
                            {/* NavLink to Home */}
                            <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
                                Home
                            </NavLink>
                        </li>
                        <li>
                            {/* NavLink to Membership */}
                            <NavLink to="/membership" onClick={() => setIsMenuOpen(false)}>
                                Membership
                            </NavLink>
                        </li>
                        <li>
                            {/* NavLink to The Club */}
                            <NavLink to="/theclub" onClick={() => setIsMenuOpen(false)}>
                                The Club
                            </NavLink>
                        </li>
                        <li>
                            {/* NavLink to Contact */}
                            <NavLink to="/contact" onClick={() => setIsMenuOpen(false)}>
                                Contact
                            </NavLink>
                        </li>
                        <li>
                            {/* NavLink to Members */}
                            <NavLink to="/members" onClick={() => setIsMenuOpen(false)}>
                                Members
                            </NavLink>
                        </li>
                        <li>
                            {/* Social media icons */}
                            <div className='social-icon'>
                                <a href="https://www.instagram.com/napoliclub/">
                                    <img width="40" height="40" src="https://img.icons8.com/fluency/40/instagram-new.png" alt="instagram-new"/>
                                </a>
                                <a href="mailto:napolijhb@gmail.com">
                                    <img width="40" height="40" src="https://img.icons8.com/fluency/40/new-post.png" alt="new-post"/>
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;