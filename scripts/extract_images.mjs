import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function run() {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const page = await browser.newPage();
  
  const imgPath = "C:/Users/user/.gemini/antigravity-ide/brain/0a71bf3f-8c3d-48cc-859f-4713490640b7/.user_uploaded/media_1789260561328.png";
  const imgBase64 = fs.readFileSync(imgPath).toString("base64");

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body>
        <img id="srcImg" src="data:image/png;base64,${imgBase64}" />
        <canvas id="c1"></canvas>
        <canvas id="c2"></canvas>
      </body>
    </html>
  `);

  await page.waitForSelector("#srcImg");
  await page.waitForTimeout(1000);

  const res = await page.evaluate(() => {
    const img = document.getElementById("srcImg");
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    
    // In media_1789260561328.png (1920x960 layout):
    // 1. School girl ("A night"):
    // left: ~153px / 1920, top: ~170px / 960, width: ~108px / 1920, height: ~295px / 960
    // 2. Tokyo Street Photography neon:
    // left: ~386px / 1920, top: ~323px / 960, width: ~108px / 1920, height: ~322px / 960

    function crop(rx, ry, rw, rh, canvasId) {
      const sx = rx * nw;
      const sy = ry * nh;
      const sw = rw * nw;
      const sh = rh * nh;

      const c = document.getElementById(canvasId);
      c.width = sw;
      c.height = sh;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      return c.toDataURL("image/png");
    }

    const girlData = crop(153 / 1920, 170 / 960, 108 / 1920, 295 / 960, "c1");
    const streetData = crop(386 / 1920, 323 / 960, 108 / 1920, 322 / 960, "c2");

    return { girlData, streetData };
  });

  const outDir = "c:/Users/user/Desktop/gallarywala/public/gallery";
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const girlBuf = Buffer.from(res.girlData.replace(/^data:image\/png;base64,/, ""), "base64");
  fs.writeFileSync(path.join(outDir, "girl_rain.png"), girlBuf);

  const streetBuf = Buffer.from(res.streetData.replace(/^data:image\/png;base64,/, ""), "base64");
  fs.writeFileSync(path.join(outDir, "tokyo_street.png"), streetBuf);

  await browser.close();
  console.log("SUCCESSFULLY EXTRACTED BOTH IMAGES TO public/gallery!");
}

run().catch(console.error);
