import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabaseClient"; // default import

import jsPDF from "jspdf";

function EventSeats() {
  const { id } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch authenticated user email
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) console.error("Error fetching user:", error);
      else if (user) setUserEmail(user.email);
    };
    fetchUser();
  }, []);

  // Fetch seats for event
  const fetchSeats = async () => {
    try {
      const res = await fetch(`http://localhost:5000/events/${id}/seats`);
      const data = await res.json();
      setSeats(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching seats:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats();
    const interval = setInterval(fetchSeats, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const handleSelectSeat = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleCheckout = async () => {
    if (!userEmail) return alert("User not authenticated.");
    if (selectedSeats.length === 0) return alert("Select at least one seat.");

    try {
      const res = await fetch("http://localhost:5000/reservations/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: parseInt(id),
          seat_numbers: selectedSeats,
          user_email: userEmail,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Tickets generated! See QR codes below.");
        setQrCodes(data.qrCodes);

        setSeats((prevSeats) =>
          prevSeats.map((s) =>
            selectedSeats.includes(s.seat_number)
              ? { ...s, status: "booked" }
              : s
          )
        );

        setSelectedSeats([]);
      } else {
        alert(data.message);
        fetchSeats();
      }
    } catch (err) {
      console.error(err);
      alert("Error during checkout");
    }
  };

  const handleDownloadPDF = () => {
    if (!qrCodes || qrCodes.length === 0) return;

    const pdf = new jsPDF();

    for (let i = 0; i < qrCodes.length; i++) {
      const imgData = qrCodes[i].qr;
      pdf.addImage(imgData, "PNG", 60, 40, 90, 90);
      pdf.text(`Reservation ID: ${qrCodes[i].reservation_id}`, 60, 35);
      if (i < qrCodes.length - 1) pdf.addPage();
    }

    pdf.save("tickets.pdf");
  };

  if (loading) return <p>Loading seats...</p>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Seat Selection for Event #{id}</h2>

      {userEmail && <p>Logged in as: {userEmail}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(9, 50px)",
          gap: "5px",
          justifyContent: "center",
          margin: "20px auto",
        }}
      >
        {seats.map((s) => (
          <button
            key={s.seat_number}
            disabled={s.status !== "available"}
            style={{
              backgroundColor: selectedSeats.includes(s.seat_number)
                ? "green"
                : s.status === "available"
                ? "lightgray"
                : "red",
              cursor: s.status === "available" ? "pointer" : "not-allowed",
            }}
            onClick={() => handleSelectSeat(s.seat_number)}
          >
            {s.seat_number}
          </button>
        ))}
      </div>

      <button
        onClick={handleCheckout}
        disabled={selectedSeats.length === 0 || !userEmail}
        style={{ padding: "10px 20px", marginBottom: "20px" }}
      >
        Checkout
      </button>

      {qrCodes.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <h3>QR Tickets</h3>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            {qrCodes.map((q) => (
              <img
                key={q.reservation_id}
                src={q.qr}
                alt={`QR for reservation ${q.reservation_id}`}
                style={{ margin: "10px" }}
              />
            ))}
          </div>

          <button
            onClick={handleDownloadPDF}
            style={{ padding: "10px 20px", marginTop: "10px" }}
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default EventSeats;
