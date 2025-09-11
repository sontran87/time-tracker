// src/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const { syncAndSeed } = require("./models"); // <-- Quan trọng

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));
app.use("/api/parts", require("./routes/parts"));
app.use("/api/product-parts", require("./routes/productParts"));
app.use("/api/workitems", require("./routes/workitems"));
app.use("/api/time-logs", require("./routes/timelogs"));
app.use("/api/reports", require("./routes/reports"));

app.get("/", (req, res) => res.send("Time Tracker backend API OK!"));

// Sync db và tạo admin mặc định trước khi dùng
syncAndSeed().then(() => {
  console.log("[DB] Database synced!");
}).catch(e => {
  console.error("[DB] Sync failed:", e);
});

module.exports = app;
