const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.get("/gamepasses", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    // 1️⃣ récupérer les expériences du joueur
    const gamesRes = await fetch(
      `https://games.roblox.com/v2/users/${userId}/games?accessFilter=Public&limit=50`
    );
    const gamesData = await gamesRes.json();

    if (!gamesData.data || gamesData.data.length === 0) {
      return res.json({ error: "No games found" });
    }

    let allPasses = [];

    // 2️⃣ récupérer les gamepasses de chaque expérience
    for (const game of gamesData.data) {
      const passesRes = await fetch(
        `https://games.roblox.com/v1/games/${game.id}/game-passes?limit=100`
      );
      const passesData = await passesRes.json();

      if (passesData.data) {
        allPasses.push(...passesData.data);
      }
    }

    if (allPasses.length === 0) {
      return res.json({ error: "No gamepasses found" });
    }

    res.json(allPasses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch gamepasses" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Proxy running on port", PORT);
});
