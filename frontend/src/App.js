import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import CheckIn from "./pages/CheckIn";
import EventSeats from "./pages/EventSeats";   // <-- ADD THIS
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/:id"               // <-- ADD THIS
          element={
            <ProtectedRoute>
              <EventSeats />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkin"
          element={
            <ProtectedRoute>
              <CheckIn />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
