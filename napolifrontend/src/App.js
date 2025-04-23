import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams, Navigate } from 'react-router-dom';
import Home from "./components/homepage/Home.jsx";
import Membership from "./components/membership/Membership.jsx";
import TheClub from "./components/theclub/TheClub.jsx";
import ContactPage from "./components/contactpage/Contact.jsx";
import Members from "./components/memberspage/Members.jsx";
import HomeLayout from './components/HomeLayout.jsx';
import ManagerDashboard from './components/dashboards/managersdashboard/ManagerDashboard.jsx';
import PlayerDashboard from './components/dashboards/playersdashboard/PlayerDashboard.jsx';
import Calendar from './components/dashboards/calender/Calender.jsx';
import GameResults from './components/gamescores/GameResults.jsx';
import DataInputDisplay from './components/dashboards/datainputdisplay/DataInputDisplay.jsx';

function App() {
  const [events, setEvents] = useState({}); 
  
  function DashboardWrapper() {
    const [searchParams] = useSearchParams();
    const username = searchParams.get('username');
    if (!username) {
      return <Navigate to="/members" />;
    }
    return <ManagerDashboard username={username} />;
  }

  function PlayerDashboardWrapper() {
    const [searchParams] = useSearchParams();
    const username = searchParams.get('username');
    if (!username) {
      return <Navigate to="/members" />;
    }
    return <PlayerDashboard username={username} />;
  }


  return (
    <>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Home />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/theclub" element={<TheClub />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/members" element={<Members />} />
      </Route>
          <Route path="/managersdashboard" element={<DashboardWrapper />} />
          <Route path="/playersdashboard" element={<PlayerDashboardWrapper />} />
          <Route path="/calendar" element={<Calendar events={events} setEvents={setEvents} />} />
          <Route path="/gameresults" element={<GameResults calendarEvents={events} />} />
          <Route path="/data-input-display" element={<DataInputDisplay />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
