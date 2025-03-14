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

// ✅ Check if a website is UP and detect Bitdefender blocks
app.get("/check-site", async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Missing URL parameter" });
    }

    try {
        // ✅ Step 1: Perform a HEAD request to check status
        const headResponse = await axios.head(url, { timeout: 10000 });
        
        // ✅ Step 2: Fetch the homepage content to detect Bitdefender
        const pageResponse = await axios.get(url, { timeout: 10000 });
        const pageContent = pageResponse.data.toLowerCase();

        // ✅ Step 3: Check if Bitdefender block message is present
        const bitdefenderBlocked = pageContent.includes("bitdefender endpoint security tools blocked this page") ||
                                   pageContent.includes("trojan.generickd");

        if (bitdefenderBlocked) {
            return res.json({ status: "Blocked", error: "Bitdefender Detected Malware Block" });
        }

        return res.json({ status: "Up", code: headResponse.status });
    } catch (error) {
        return res.json({ status: "Down", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
