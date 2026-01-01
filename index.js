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
    const url =
      `https://catalog.roblox.com/v1/search/items/details` +
      `?Category=11` +
      `&Subcategory=5` +
      `&CreatorType=User` +
      `&CreatorTargetId=${userId}` +
      `&SortType=4` +
      `&Limit=30`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return res.json({ error: "No user-created gamepasses found" });
    }

    const cleaned = data.data.map(gp => ({
      id: gp.id,
      name: gp.name,
      price: gp.price ?? 0
    }));

    res.json(cleaned);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch gamepasses" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Proxy running on port", PORT);
});
