require("dotenv").config();
const express = require("express");
const cors = require("cors");
const reservationsRouter = require("./routes/reservations");
const eventsRouter = require("./routes/events");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/reservations", reservationsRouter);
app.use("/events", eventsRouter);

// Use environment PORT (for Render) or fallback to 5000 locally
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
