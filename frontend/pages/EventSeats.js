import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function EventSeats() {
  const { id } = useParams();

  // Static seat layout for MVP (8 rows × 10 seats)
  const rows = 8;
  const cols = 10;

  const initialSeats = Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) => ({
      id: `${rowIndex + 1}-${colIndex + 1}`,
      status: "available", // later: booked, held
    }))
  );

  const [seats, setSeats] = useState(initialSeats);
  const [selected, setSelected] = useState([]);

  const toggleSeat = (seat) => {
    if (seat.status === "booked") return; // cannot click booked seats

    const alreadySelected = selected.includes(seat.id);

    if (alreadySelected) {
      setSelected(selected.filter((s) => s !== seat.id));
    } else {
      setSelected([...selected, seat.id]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Select Seats For Event #{id}</h2>

      {/* Seat Grid */}
      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateRows: `repeat(${rows}, auto)`,
          gap: "10px"
        }}
      >
        {seats.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 40px)`, gap: "8px" }}
          >
            {row.map((seat) => {
              const isSelected = selected.includes(seat.id);

              let bg = "#ddd"; // available
              if (seat.status === "booked") bg = "red";
              if (isSelected) bg = "green";

              return (
                <div
                  key={seat.id}
                  onClick={() => toggleSeat(seat)}
                  style={{
                    width: "40px",
                    height: "40px",
                    background: bg,
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: seat.status === "booked" ? "not-allowed" : "pointer",
                    color: "#000",
                    userSelect: "none"
                  }}
                >
                  {seat.id}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Continue button */}
      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => {
            alert("Selected seats: " + selected.join(", "));
          }}
          style={{
            padding: "12px 20px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Continue Reservation
        </button>
      </div>
    </div>
  );
}
