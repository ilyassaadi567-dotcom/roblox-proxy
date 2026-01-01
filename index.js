const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.get("/gamepasses", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const url = `https://inventory.roblox.com/v1/users/${userId}/inventory?assetTypeId=34&limit=100`;
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
