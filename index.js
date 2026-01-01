const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/", (req, res) => {
  res.send("proxy ok");
});

app.get("/gamepasses", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const url = `https://games.roblox.com/v1/game-passes/users/${userId}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.data || data.data.length === 0) {
      return res.json({ gamepasses: [] });
    }

    const gamepasses = data.data.map(gp => ({
      id: gp.id,
      name: gp.name,
      price: gp.price
    }));

    res.json({ gamepasses });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch gamepasses" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
