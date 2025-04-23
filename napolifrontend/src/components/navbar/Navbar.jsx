import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import napoliLogo from './assets/Napoli-2020.png';
import './navbarstyle.css'; 



/**
 * Navbar Component:
 *
 * This component renders the navigation bar for the application. It includes the logo,
 * site navigation links, and social media links.  The component also handles the
 * mobile menu functionality, including toggling the menu's visibility and preventing
 * background scrolling when the menu is open.
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
                                    <img width="40" height="40" src="https://img.icons8.com/ios-filled/40/228BE6/instagram-new--v1.png" alt="instagram-new--v1"/>
                                </a>
                                <a href="mailto:napolijhb@gmail.com">
                                    <img width="40" height="40" src="https://img.icons8.com/ios-filled/40/228BE6/new-post.png" alt="new-post"/>
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