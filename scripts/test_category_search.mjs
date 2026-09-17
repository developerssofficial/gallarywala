import { chromium } from "playwright";
import { spawn } from "child_process";

async function run() {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });

  const srv = spawn("npx", ["vite", "preview", "--port", "4173"], { cwd: "c:/Users/user/Desktop/gallarywala", shell: true });

  await new Promise(r => setTimeout(r, 2500));

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  
  // Set user before loading page
  await context.addInitScript(() => {
    const user = {
      id: "u-creator-1",
      email: "xparrowdev@gmail.com",
      user_metadata: { full_name: "xparrowdev", username: "xparrowdev" }
    };
    localStorage.setItem("gallarywala_session_user", JSON.stringify(user));
  });

  const page = await context.newPage();
  await page.goto("http://localhost:4173", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Click "+ Create" button
  const createBtn = page.locator("button:has-text('Create')").first();
  await createBtn.click();
  await page.waitForTimeout(1000);

  // Click "Search Category" button inside modal
  const searchCatBtn = page.locator("button:has-text('Search Category')").first();
  if (await searchCatBtn.count() > 0) {
    await searchCatBtn.click();
    await page.waitForTimeout(500);

    // Type "car" in the category search box
    const searchInput = page.locator("input[placeholder*='Type to search']").first();
    if (await searchInput.count() > 0) {
      await searchInput.fill("car");
      await page.waitForTimeout(500);
    }
  }

  await page.screenshot({ path: "C:/Users/user/.gemini/antigravity-ide/brain/0a71bf3f-8c3d-48cc-859f-4713490640b7/category_search_live.png" });

  srv.kill();
  await browser.close();
  console.log("CATEGORY_SEARCH_LIVE_DONE");
}

run().catch(console.error);
