import { chromium } from "playwright";
import { spawn } from "child_process";

async function run() {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });

  const srv = spawn("npx", ["vite", "preview", "--port", "4173"], { cwd: "c:/Users/user/Desktop/gallarywala", shell: true });

  await new Promise(r => setTimeout(r, 3000));

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  await page.goto("http://localhost:4173", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "C:/Users/user/.gemini/antigravity-ide/brain/0a71bf3f-8c3d-48cc-859f-4713490640b7/perfect_6_feed.png" });

  const porscheImg = page.locator("img[src*='porsche']").first();
  if (await porscheImg.count() > 0) {
    await porscheImg.click({ force: true });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "C:/Users/user/.gemini/antigravity-ide/brain/0a71bf3f-8c3d-48cc-859f-4713490640b7/perfect_porsche_modal.png" });
  }

  srv.kill();
  await browser.close();
  console.log("SCREENSHOTS_DONE");
}

run().catch(console.error);
