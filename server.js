const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Fix CORS to allow requests only from your frontend
app.use(cors({
    origin: "https://web-checker-1.onrender.com",
    methods: "GET",
    allowedHeaders: "Content-Type"
}));

app.get("/", (req, res) => {
    res.send("✅ Website Monitor Backend is Running!");
});

app.get("/check-site", async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Missing URL parameter" });
    }

    try {
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; WebChecker/1.0; +https://yourdomain.com)'
            },
            validateStatus: () => true  // Don't throw on 4xx/5xx
        });

        return res.json({ status: "Up", code: response.status });
    } catch (error) {
        console.error(`[ERROR] ${url} -> ${error.code || error.message}`);
        return res.json({ status: "Down or Blocked", error: error.code || error.message });
    }
});


app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
