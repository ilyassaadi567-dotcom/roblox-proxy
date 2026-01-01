const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/", (req, res) => {
  res.send("proxy ok");
});

app.get("/gamepasses", async (req, res) => {
  const gameId = req.query.gameId;
  if (!gameId) {
    return res.status(400).json({ error: "Missing gameId" });
  }

  try {
    const url = `https://games.roblox.com/v1/games/${gameId}/game-passes?limit=100`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return res.json({ error: "No gamepasses found" });
    }

    res.json(data.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch gamepasses" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Proxy running on port", PORT);
});
