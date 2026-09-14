import { chromium } from "playwright";
import { preview } from "vite";

async function run() {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  
  // Start Vite preview server programmatically
  const previewServer = await preview({
    preview: { port: 4173 }
  });

  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  
  await context.addInitScript(() => {
    const sample = [{
      id: 'sp-26',
      title: 'Sasuke uchiha',
      imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80',
      category: 'Anime',
      likes: 12,
      author: { name: 'Oneshot Play', username: '@oneshotplay554', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=oneshot' }
    }];
    localStorage.setItem('gallarywala_pins_v9', JSON.stringify(sample));
  });

  const page = await context.newPage();
  await page.goto("http://localhost:4173/?pin=sp-26", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 1. Take screenshot of Modal with new Back Button & Full View trigger
  await page.screenshot({ path: "C:/Users/user/.gemini/antigravity-ide/brain/0a71bf3f-8c3d-48cc-859f-4713490640b7/modal_with_back_and_fullview.png" });
  console.log("MODAL_SCREENSHOT_TAKEN");

  // 2. Click Full View button
  const fullViewBtn = await page.$('.full-view-badge-btn');
  if (fullViewBtn) {
    await fullViewBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: "C:/Users/user/.gemini/antigravity-ide/brain/0a71bf3f-8c3d-48cc-859f-4713490640b7/fullscreen_theatre_lightbox.png" });
    console.log("FULLVIEW_SCREENSHOT_TAKEN");
  }

  // 3. Mobile responsive test
  const mobileContext = await browser.newContext({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("http://localhost:4173/?pin=sp-26", { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: "C:/Users/user/.gemini/antigravity-ide/brain/0a71bf3f-8c3d-48cc-859f-4713490640b7/modal_mobile_view.png" });

  await browser.close();
  await previewServer.httpServer.close();
  process.exit(0);
}
run();
