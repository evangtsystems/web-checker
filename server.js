const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Fix CORS to allow requests only from your frontend
app.use(
  cors({
    origin: "https://web-checker-1.onrender.com",
    methods: "GET",
    allowedHeaders: "Content-Type",
  })
);

app.get("/", (req, res) => {
  res.send("✅ Website Monitor Backend is Running!");
});

// ✅ Function to validate website by fetching images (favicon/logo)
const scrapeImageValidation = async (siteUrl) => {
  try {
    const res = await axios.get(`${siteUrl}/favicon.ico`, {
      responseType: "arraybuffer",
      timeout: 8000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
      },
    });
    const contentType = res.headers["content-type"];
    if (res.status === 200 && contentType && contentType.includes("image")) {
      return true;
    }
  } catch (error) {
    // If favicon fails, try an alternative image path (like /logo.png)
    try {
      const res = await axios.get(`${siteUrl}/logo.png`, {
        responseType: "arraybuffer",
        timeout: 8000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
        },
      });
      const contentType = res.headers["content-type"];
      if (res.status === 200 && contentType && contentType.includes("image")) {
        return true;
      }
    } catch (error2) {
      return false;
    }
  }
  return false;
};

// ✅ Check if a website is UP and detect Bitdefender blocks
app.get("/check-site", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  try {
    // First, attempt a HEAD request
    let headResponse;
    try {
      headResponse = await axios.head(url, { timeout: 10000 });
    } catch (headError) {
      // If HEAD fails (many sites don't handle HEAD requests well), try a GET request
      headResponse = await axios.get(url, {
        timeout: 10000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.0.0 Safari/537.36",
        },
      });
    }

    // Now, fetch the homepage content (GET) to scan for Bitdefender block messages
    let pageResponse;
    try {
      pageResponse = await axios.get(url, {
        timeout: 10000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.0.0 Safari/537.36",
        },
      });
    } catch (getError) {
      pageResponse = { data: "" };
    }
    const pageContent = pageResponse.data.toLowerCase();

    // Check for Bitdefender block messages
    const bitdefenderBlocked =
      pageContent.includes("bitdefender endpoint security tools blocked this page") ||
      pageContent.includes("trojan.generickd");

    if (bitdefenderBlocked) {
      return res.json({ status: "Blocked", error: "Bitdefender Detected Malware Block" });
    }

    // ✅ Perform image validation as an extra check
    const imageValid = await scrapeImageValidation(url);

    return res.json({
      status: imageValid ? "Up" : "❌ Inaccessible (Image validation failed)",
      code: headResponse.status,
    });
  } catch (error) {
    return res.json({ status: "Down", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
