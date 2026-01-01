const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.get("/gamepasses", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    // 1️⃣ récupérer les PLACES créées par le joueur
    const gamesRes = await fetch(
      `https://games.roblox.com/v2/users/${userId}/games?accessFilter=Public&limit=50`
    );
    const gamesData = await gamesRes.json();

    if (!gamesData.data || gamesData.data.length === 0) {
      return res.json({ error: "No games found" });
    }

    let allGamepasses = [];

    for (const game of gamesData.data) {
      const placeId = game.id;

      // 2️⃣ placeId -> universeId
      const universeRes = await fetch(
        `https://apis.roblox.com/universes/v1/places/${placeId}/universe`
      );
      const universeData = await universeRes.json();

      if (!universeData.universeId) continue;

      const universeId = universeData.universeId;

      // 3️⃣ récupérer les gamepasses du universe
      const passesRes = await fetch(
        `https://games.roblox.com/v1/games/${universeId}/game-passes?limit=100`
      );
      const passesData = await passesRes.json();

      if (passesData.data && passesData.data.length > 0) {
        allGamepasses.push(...passesData.data);
      }
    }

    if (allGamepasses.length === 0) {
      return res.json({ error: "No gamepasses found" });
    }

    res.json(allGamepasses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch gamepasses" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Proxy running on port", PORT);
});

