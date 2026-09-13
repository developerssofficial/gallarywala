import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function run() {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  const srcPath = "C:/Users/user/.gemini/antigravity-ide/brain/0a71bf3f-8c3d-48cc-859f-4713490640b7/.user_uploaded/media_1789267646806.png";
  const base64 = fs.readFileSync(srcPath).toString("base64");

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; background: #000;">
        <img id="source" src="data:image/png;base64,${base64}" style="display: block; width: 1920px; height: 960px;" />
        <canvas id="cvsGirl"></canvas>
        <canvas id="cvsStreet"></canvas>
      </body>
    </html>
  `);

  await page.waitForSelector("#source");
  await page.waitForTimeout(1000);

  const res = await page.evaluate(() => {
    const img = document.getElementById("source");
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;

    // media_1789267646806.png is 1920 x 960
    // 1. School girl (top left pin):
    // x: 294, y: 165, w: 205, h: 295 (proportional to 1920x960)
    // Let's measure accurately:
    // Left edge of girl card: 294 / 1920 * nw
    // Top edge: 165 / 960 * nh
    // Width: 206 / 1920 * nw
    // Height: 295 / 960 * nh

    function getSlice(x, y, w, h, cid) {
      const c = document.getElementById(cid);
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
      return c.toDataURL("image/png");
    }

    // In 1920x960 screenshot:
    // Col 1 (Girl): left ~294, top ~165, width ~206, height ~295
    // Col 3 (Tokyo street): left ~742, top ~323, width ~206, height ~322
    const girl = getSlice(294 / 1920 * nw, 165 / 960 * nh, 206 / 1920 * nw, 295 / 960 * nh, "cvsGirl");
    const street = getSlice(742 / 1920 * nw, 323 / 960 * nh, 206 / 1920 * nw, 322 / 960 * nh, "cvsStreet");

    return { girl, street };
  });

  const outDir = "c:/Users/user/Desktop/gallarywala/public/gallery";
  fs.writeFileSync(path.join(outDir, "girl_rain.png"), Buffer.from(res.girl.replace(/^data:image\/png;base64,/, ""), "base64"));
  fs.writeFileSync(path.join(outDir, "tokyo_street.png"), Buffer.from(res.street.replace(/^data:image\/png;base64,/, ""), "base64"));

  await browser.close();
  console.log("CROP PERFECT DONE!");
}

run().catch(console.error);
