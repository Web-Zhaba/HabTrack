import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.resolve('screenshots');

const routes = [
  { path: '/', name: 'home' },
  { path: '/login', name: 'login' },
  { path: '/register', name: 'register' },
  { path: '/reset-password', name: 'reset-password' },
  { path: '/habits', name: 'habits' },
  { path: '/stats', name: 'stats' },
  { path: '/settings', name: 'settings' },
  { path: '/friends', name: 'friends' },
  { path: '/habit/1', name: 'habit-detail' },
  { path: '/404', name: 'not-found' },
];

(async () => {
  console.log('Starting screenshot process...');
  
  if (!fs.existsSync(OUTPUT_DIR)){
    fs.mkdirSync(OUTPUT_DIR);
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  for (const route of routes) {
    const url = `${BASE_URL}${route.path}`;
    console.log(`Navigating to ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      // Add a small delay to ensure animations/rendering is complete if needed
      await new Promise(r => setTimeout(r, 1000));
      
      const screenshotPath = path.join(OUTPUT_DIR, `${route.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Saved screenshot for ${route.name} at ${screenshotPath}`);
    } catch (error) {
      console.error(`Error capturing ${route.name}:`, error);
    }
  }

  await browser.close();
  console.log('Screenshot process completed.');
})();
