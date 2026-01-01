const express = require("express");
const fetch = require("node-fetch");

const app = express();

// route test (pour voir si le proxy marche)
app.get("/", (req, res) => {
  res.send("Proxy OK");
});

// route pour récupérer les gamepasses d'un joueur
app.get("/gamepasses", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const url = `https://catalog.roblox.com/v1/game-passes?creatorType=User&creatorTargetId=${userId}&limit=50`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return res.json({ error: "No gamepasses found" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch gamepasses" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Proxy running on port", PORT);
});
