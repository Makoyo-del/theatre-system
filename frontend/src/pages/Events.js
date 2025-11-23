import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("Events")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error);
      } else {
        setEvents(data);
      }

      setLoading(false);
    }

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (events.length === 0) return <p>No events found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upcoming Events</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "20px" }}>
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => navigate(`/events/${event.id}`)}
            style={{
              width: "200px",
              padding: "16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p style={{ fontWeight: "bold" }}>
              {new Date(event.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
