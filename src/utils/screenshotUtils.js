import puppeteer from "puppeteer";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import fs from "fs-extra";

const SCREENSHOT_DIR = "screenshots";
fs.ensureDirSync(SCREENSHOT_DIR);

export const takeScreenshot = async (site) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(site.url, { waitUntil: "networkidle2" });

    const screenshotPath = `${SCREENSHOT_DIR}/${site.name.replace(/\s/g, "_")}.png`;
    await page.screenshot({ path: screenshotPath });

    await browser.close();
    return screenshotPath;
};

export const compareScreenshots = (beforePath, afterPath, diffPath) => {
    if (!fs.existsSync(beforePath) || !fs.existsSync(afterPath)) return false;

    const img1 = PNG.sync.read(fs.readFileSync(beforePath));
    const img2 = PNG.sync.read(fs.readFileSync(afterPath));

    const { width, height } = img1;
    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

    if (numDiffPixels > 0) {
        fs.writeFileSync(diffPath, PNG.sync.write(diff));
        return true; // Layout changed
    }
    return false;
};
