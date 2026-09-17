import { chromium } from "playwright";
import { spawn } from "child_process";

async function run() {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const srv = spawn("npx", ["vite", "preview", "--port", "4173"], { cwd: "c:/Users/user/Desktop/gallarywala", shell: true });
  await new Promise(r => setTimeout(r, 2500));

  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  
  await context.addInitScript(() => {
    const sample = [{
      id: 'test-1',
      title: 'Neon Cyberpunk Street',
      imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80',
      category: '4K Wallpapers',
      likes: 5,
      author: { name: 'Creator', username: '@creator', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=test' }
    }];
    localStorage.setItem('gallarywala_pins_v8', JSON.stringify(sample));
  });

  const page = await context.newPage();
  await page.goto("http://localhost:4173", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const card = await page.$('.pin-card');
  if (card) {
    await card.hover();
    await page.waitForTimeout(500);
    await page.screenshot({ path: "C:/Users/user/.gemini/antigravity-ide/brain/0a71bf3f-8c3d-48cc-859f-4713490640b7/download_icon_fixed.png" });
    console.log("DOWNLOAD_ICON_FIXED_SCREENSHOT_TAKEN");
  } else {
    console.log("CARD_NOT_FOUND");
  }

  await browser.close();
  srv.kill();
  process.exit(0);
}
run();
