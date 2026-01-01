const express = require("express");
const fetch = require("node-fetch");
const app = express();

const PORT = process.env.PORT || 3000;

// Route test (OBLIGATOIRE)
app.get("/", (req, res) => {
  res.send("PROXY OK");
});

app.get("/gamepasses", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const url = `https://catalog.roproxy.com/v1/search/items/details?Category=11&Subcategory=5&CreatorTargetId=${userId}&SortType=4&SortAggregation=5&Limit=30`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch gamepasses" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
