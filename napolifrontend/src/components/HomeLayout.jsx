import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "./navbar/Navbar.jsx";

/**
 * HomeLayout Component
 *
 * This component serves as the layout structure for the home section of the application.
 * It includes the Navbar for consistent navigation across all pages within this layout
 * and uses the Outlet component to render the specific child route content. This pattern
 * is commonly used in React Router to create a shared layout.
 */
function HomeLayout() {
    return (
      <>
        {/* Navbar:  Provides consistent navigation for the home layout */}
        <Navbar />
  
        {/* Outlet:  Renders the current child route's component */}
        <Outlet />
      </>
    );
  }
  
  export default HomeLayout;