const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow all origins temporarily (for debugging)
app.use(cors({
    origin: "*", // Change this to "https://web-checker-1.onrender.com" after testing
    methods: "GET",
    allowedHeaders: "Content-Type"
}));

// ✅ Ensure CORS headers are set for all routes
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow frontend requests
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.get("/", (req, res) => {
    res.send("✅ Website Monitor Backend is Running!");
});

// ✅ Puppeteer-based website checker
app.get("/check-site", async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Missing URL parameter" });
    }

    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36");
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

        const pageContent = await page.content();
        await browser.close();

        const bitdefenderBlocked =
            pageContent.includes("bitdefender endpoint security tools blocked this page") ||
            pageContent.includes("trojan.generickd");

        if (bitdefenderBlocked) {
            return res.json({ status: "Blocked", error: "Bitdefender Detected Malware Block" });
        }

        return res.json({ status: "Up", code: 200 });
    } catch (error) {
        return res.json({ status: "Down", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
