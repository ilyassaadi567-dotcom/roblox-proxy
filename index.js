const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.get("/gamepasses", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const url = `https://catalog.roproxy.com/v1/users/${userId}/items?AssetType=34`;
    const response = await fetch(url, { redirect: "follow" });
    const data = await response.json();

    if (!data || !data.data) {
      return res.status(404).json({ error: "No gamepasses found" });
    }

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

