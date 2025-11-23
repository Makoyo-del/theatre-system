const express = require("express");
const cors = require("cors");
const reservationsRouter = require("./routes/reservations");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/reservations", reservationsRouter);

app.listen(5000, () => console.log("Server running on port 5000"));
