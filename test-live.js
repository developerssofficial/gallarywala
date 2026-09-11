import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  const consoleLogs = [];
  const errors = [];

  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    errors.push(err.toString());
  });

  console.log('Navigating to https://gallarywala.vercel.app ...');
  await page.goto('https://gallarywala.vercel.app', { waitUntil: 'networkidle' });
  
  const title = await page.title();
  console.log('Page Title:', title);

  const heroTitle = await page.locator('.hero-title').innerText().catch(() => 'NOT FOUND');
  console.log('Hero Title:', heroTitle);

  const navbar = await page.locator('.brand-text-gradient').first().innerText().catch(() => 'NOT FOUND');
  console.log('Brand in Navbar:', navbar);

  await page.screenshot({ path: 'realtime_check.png', fullPage: false });
  console.log('Screenshot saved to realtime_check.png');

  console.log('Console Logs count:', consoleLogs.length);
  if (consoleLogs.length > 0) {
    console.log('Console Logs:', consoleLogs);
  }
  console.log('Page Errors count:', errors.length);
  if (errors.length > 0) {
    console.log('Page Errors:', errors);
  }

  await browser.close();
}

run().catch(console.error);
