import { chromium } from "playwright";
import { spawn } from "child_process";
import fs from "fs";

async function runBenchmark() {
  console.log("🚀 Starting GallaryWala Comprehensive Benchmark Audit...");

  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const srv = spawn("npx", ["vite", "preview", "--port", "4173"], { cwd: "c:/Users/user/Desktop/gallarywala", shell: true });
  await new Promise(r => setTimeout(r, 2500));

  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  
  // 1. Desktop Test
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  });

  const page = await desktopContext.newPage();

  // Inject performance marks
  const startTime = Date.now();
  const response = await page.goto("http://localhost:4173", { waitUntil: "networkidle" });
  const loadTime = Date.now() - startTime;
  const httpStatus = response.status();

  // Performance metrics via Navigation Timing API & Performance API
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paint = performance.getEntriesByType("paint");
    const fcp = paint.find(p => p.name === "first-contentful-paint")?.startTime || 0;
    
    // DOM metrics
    const totalDomElements = document.querySelectorAll("*").length;
    const imagesCount = document.querySelectorAll("img").length;
    const imagesWithAlt = Array.from(document.querySelectorAll("img")).filter(img => img.hasAttribute("alt") && img.alt.length > 0).length;

    // SEO checks
    const hasTitle = Boolean(document.title && document.title.length > 10);
    const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute("content");
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href");
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content");
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content");
    const schemaScript = document.querySelector('script[type="application/ld+json"]');

    return {
      fcp: Math.round(fcp),
      domInteractive: Math.round(nav.domInteractive),
      domComplete: Math.round(nav.domComplete),
      transferSize: nav.transferSize,
      encodedBodySize: nav.encodedBodySize,
      decodedBodySize: nav.decodedBodySize,
      totalDomElements,
      imagesCount,
      imagesWithAlt,
      hasTitle,
      titleText: document.title,
      hasMetaDesc: Boolean(metaDesc && metaDesc.length > 20),
      metaDescText: metaDesc,
      canonicalUrl: canonical,
      ogTitle,
      ogImage,
      hasSchemaJson: Boolean(schemaScript)
    };
  });

  // Take Desktop Screenshot
  await page.screenshot({ path: "C:/Users/user/.gemini/antigravity-ide/brain/0a71bf3f-8c3d-48cc-859f-4713490640b7/benchmark_desktop.png" });

  // 2. Mobile Responsive Test (iPhone 14 Pro Max simulation)
  const mobileContext = await browser.newContext({
    viewport: { width: 393, height: 852 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  const mobileStart = Date.now();
  await mobilePage.goto("http://localhost:4173", { waitUntil: "networkidle" });
  const mobileLoadTime = Date.now() - mobileStart;

  await mobilePage.screenshot({ path: "C:/Users/user/.gemini/antigravity-ide/brain/0a71bf3f-8c3d-48cc-859f-4713490640b7/benchmark_mobile.png" });

  await browser.close();
  srv.kill();

  const report = {
    httpStatus,
    desktopLoadTimeMs: loadTime,
    mobileLoadTimeMs: mobileLoadTime,
    metrics
  };

  fs.writeFileSync("./scripts/benchmark_result.json", JSON.stringify(report, null, 2), "utf8");
  console.log("BENCHMARK_COMPLETE:", JSON.stringify(report, null, 2));
}

runBenchmark();
