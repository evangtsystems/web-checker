const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;  // ✅ Use dynamic port for Render

app.use(cors());  // ✅ Allows requests from any frontend

app.get("/check-site", async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Missing URL parameter" });
    }

    try {
        // Try HEAD request first (faster)
        const response = await axios.head(url, { timeout: 10000 });

        return res.json({ status: "Up", code: response.status });
    } catch (error) {
        return res.json({ status: "Down or Blocked", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
