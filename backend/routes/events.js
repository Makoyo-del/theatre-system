const express = require("express");
const supabase = require("../supabaseClient");
const router = express.Router();

// GET seats for a specific event
router.get("/:id/seats", async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("EventSeats")
      .select("*")
      .eq("event_id", parseInt(id))
      .order("seat_number", { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Error fetching seats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
