const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const QRCode = require("qrcode");

// Checkout endpoint: create & confirm reservation + generate QR
router.post("/checkout", async (req, res) => {
  const { event_id, seat_numbers, user_email } = req.body;

  if (!event_id || !seat_numbers || seat_numbers.length === 0)
    return res.status(400).json({ message: "Invalid request" });

  try {
    // Fetch seats for this event
    const { data: seats, error: seatError } = await supabase
      .from("EventSeats")
      .select("*")
      .eq("event_id", event_id)
      .in("seat_number", seat_numbers);

    if (seatError) throw seatError;

    if (seats.length !== seat_numbers.length)
      return res.status(400).json({ message: "Some seats are invalid" });

    // Update seats as booked
    const seatIds = seats.map((s) => s.id);

    const { data: reservations, error: resError } = await supabase
      .from("Reservations")
      .insert(
        seatIds.map((id) => ({
          event_id,
          seat_id: id,
          user_email,
          status: "confirmed",
        }))
      )
      .select();

    if (resError) throw resError;

    // Generate QR codes
    const qrCodes = await Promise.all(
      reservations.map(async (r) => ({
        reservation_id: r.id,
        qr: await QRCode.toDataURL(`reservation_id:${r.id}`),
      }))
    );

    res.json({ qrCodes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
