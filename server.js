const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

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
        const response = await axios.get(url, { timeout: 10000 });

        // Convert response text to string for malware detection
        const responseData = response.data.toString().toLowerCase();

        // Detect Malware Block Page (Bitdefender, Norton, etc.)
        if (
            responseData.includes("bitdefender") || 
            responseData.includes("this page contains malware") || 
            responseData.includes("access has been blocked") || 
            responseData.includes("dangerous website") ||
            responseData.includes("malware detected")
        ) {
            console.log(`🚨 [MALWARE WARNING] ${url} is BLOCKED by security software.`);
            return res.json({ status: "Blocked", reason: "Detected as Malware", code: 403 });
        }

        return res.json({ status: "Up", code: response.status });

    } catch (error) {
        console.error(`❌ ERROR CHECKING ${url}: ${error.message}`);

        // Detect if request failed due to blocking (e.g., connection reset)
        if (error.message.includes("ECONNRESET") || error.message.includes("403")) {
            return res.json({ status: "Blocked", reason: "Access Denied by Security", code: 403 });
        }

        return res.json({ status: "Down or Blocked", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
