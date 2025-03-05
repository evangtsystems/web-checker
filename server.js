const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Enable CORS for all frontend requests
app.use(cors());

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

// Start the proxy server
app.listen(PORT, () => {
    console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
