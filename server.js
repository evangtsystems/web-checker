const express = require("express");
const puppeteer = require("puppeteer-core");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow frontend requests
app.use(cors({
    origin: "https://web-checker-1.onrender.com",
    methods: "GET",
    allowedHeaders: "Content-Type"
}));

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
        const puppeteer = require("puppeteer-core");

const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: "/usr/bin/google-chrome-stable" // Render's Chromium path
});

        const page = await browser.newPage();

        // ✅ Set a user-agent to mimic a real browser
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"
        );

        // ✅ Navigate to the site (timeout after 15 seconds)
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

        // ✅ Extract page content
        const pageContent = await page.content();

        // ✅ Screenshot for debugging (optional)
        await page.screenshot({ path: `screenshots/${new URL(url).hostname}.png`, fullPage: true });

        await browser.close();

        // ✅ Detect Bitdefender block message
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

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
