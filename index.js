const express = require("express");
const fetch = require("node-fetch");

const app = express();

// Route de test
app.get("/", (req, res) => {
  res.send("proxy ok");
});

// Route pour récupérer les gamepasses
app.get("/gamepasses", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    // Utilisation de RoTunnel au lieu de roblox.com
    const url = `https://catalog.rotunnel.com/v1/search/items?creatorTargetId=${userId}&creatorType=User&assetTypes=GamePass&limit=100`;
    const response = await fetch(url);
    const data = await response.json();

    // Vérification des données
    if (!data || !data.data || data.data.length === 0) {
      return res.json({ gamepasses: [] });
    }

    // Formatage des gamepasses
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

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
