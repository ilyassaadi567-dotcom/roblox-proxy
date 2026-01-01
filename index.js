constconst express = require("express");
const fetch = require("node-fetch");
const app = express();

app.get("/gamepasses", async (req, res) => {
  const gameId = req.query.gameId;
  const userId = req.query.userId;

  if (!gameId || !userId) {
    return res.status(400).json({ error: "Missing gameId or userId" });
  }

  try {
    const url = `https://games.roblox.com/v1/games/${gameId}/game-passes?limit=50`;
    const response = await fetch(url);
    const data = await response.json();

    // Filtre les gamepasses créés par le joueur
    const filtered = data.data.filter(
      gp => gp.creator && gp.creator.id == userId
    );

    res.json(filtered);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch gamepasses" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Proxy running on port", PORT);
});
