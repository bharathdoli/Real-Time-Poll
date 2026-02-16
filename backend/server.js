require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const Poll = require("./models/poll");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"));

io.on("connection", (socket) => {
  socket.on("join", (pollId) => socket.join(pollId));
  socket.on("vote", async ({ pollId, optionIndex }) => {
    const voter = socket.id;

    const poll = await Poll.findById(pollId);

    if (poll.voters.includes(voter)) return;

    poll.options[optionIndex].votes++;
    poll.voters.push(voter);

    await poll.save();

    io.to(pollId).emit("update", poll);
  });
});

app.post("/poll", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const poll = await Poll.create({
      question: req.body.question,
      options: req.body.options.map((option) => ({ text: option, votes: 0 })),
      voters: [],
    });

    res.json(poll);
  } catch (err) {
    console.error("CREATE POLL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/poll/:id", async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  res.json(poll);
});

server.listen(5000, () => console.log("Server running on port 5000"));
