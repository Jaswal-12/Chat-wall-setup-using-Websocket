const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

// Express CORS
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Test Route
app.get("/", (req, res) => {
  res.send("Server Running...");
});

io.on("connection", (socket) => {
  console.log("✅ User Connected:", socket.id);

  socket.on("send-message", (data) => {
    console.log("📩 Message Received:", data);

    io.emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("🚀 Server Running On Port 5000");
});