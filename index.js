app.get("/gamepasses", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const url = `https://games.roproxy.com/v1/game-passes/users/${userId}`;
    const response = await fetch(url, { redirect: "follow" });
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

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch gamepasses" });
  }
});


