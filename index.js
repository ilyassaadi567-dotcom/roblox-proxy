const express = require("express");
const fetch = require("node-fetch");
const app = express();

// Route pour récupérer les gamepasses d'un utilisateur Roblox
app.get("/gamepasses", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    // Endpoint roproxy officiel pour récupérer les gamepasses par CreatorId
    const url = `https://api.roproxy.com/users/${userId}/assets?type=GamePass`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.data) {
      return res.status(404).json({ error: "No gamepasses found" });
    }

    // On ne renvoie que les infos utiles : id, name, price
    const gamepasses = data.data.map(gp => ({
      id: gp.id,
      name: gp.name,
      price: gp.price
    }));

    res.json({ gamepasses });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch gamepasses" });
  }
});

// Port dynamique pour Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
