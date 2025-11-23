import React from 'react';
import { Link } from 'react-router-dom';
import './PortalLayout.css';

export default function PortalLayout({ children }) {
  return (
    <div className="portal-container">
      <aside className="sidebar">
        <h2 className="logo">TheatreSys</h2>
        <nav>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/checkin">Check-In</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
